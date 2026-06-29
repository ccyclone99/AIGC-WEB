import { CheckCircle2, Images, Play, Upload } from 'lucide-react'
import { useState, type ChangeEvent } from 'react'

import { canUseAssetForGeneration, filterAssetByCategory } from '../domain'
import type { Asset, AssetFilter, UploadReceipt } from '../types'
import { assetFilterEmptyText } from '../viewModels'
import { UploadReceiptPanel } from './UploadReceiptPanel'

type AssetPickerProps = {
  assets: Asset[]
  assetFilters: AssetFilter[]
  selectedAssetId: string
  uploadReceipt: UploadReceipt
  onCancelUpload: () => void
  onPreview: (title: string, image: string) => void
  onRetryUpload: () => void
  onSelect: (assetId: string) => void
  onUpload: (file: File) => void
}

export function AssetPicker({
  assets,
  assetFilters,
  selectedAssetId,
  uploadReceipt,
  onCancelUpload,
  onPreview,
  onRetryUpload,
  onSelect,
  onUpload,
}: AssetPickerProps) {
  const [assetFilter, setAssetFilter] = useState<AssetFilter>('全部')
  const selectedAsset = selectedAssetId ? assets.find((asset) => asset.id === selectedAssetId) : undefined
  const usableAssetCount = assets.filter(canUseAssetForGeneration).length
  const previewOnlyCount = assets.filter((asset) => asset.status === 'library' && !canUseAssetForGeneration(asset)).length
  const getFilterCount = (filter: AssetFilter) => assets.filter((asset) => filterAssetByCategory(asset, filter)).length
  const visibleAssetFilters = assetFilters.filter((filter) => filter === '全部' || getFilterCount(filter) > 0)
  const visibleAssets = assets
    .filter((asset) => filterAssetByCategory(asset, assetFilter))
    .sort((a, b) => Number(canUseAssetForGeneration(b)) - Number(canUseAssetForGeneration(a)))

  const handlePickerUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0]
    if (file) onUpload(file)
    event.currentTarget.value = ''
  }

  return (
    <div className="asset-picker">
      <header className="asset-picker-head">
        <div>
          <p className="eyebrow">资产库</p>
          <strong>先从资产库选图，也可以直接上传新图片。</strong>
        </div>
        <span>{usableAssetCount} 个图片素材可用于当前模板</span>
      </header>

      <section className="asset-picker-status-strip">
        <span>
          <CheckCircle2 size={17} />
          <strong>当前</strong>
          <em>{selectedAsset?.name ?? '未选择图片'}</em>
        </span>
        <span>
          <Images size={17} />
          <strong>可生成</strong>
          <em>{usableAssetCount} 个图片</em>
        </span>
        <span>
          <Play size={17} />
          <strong>仅预览</strong>
          <em>{previewOnlyCount} 个素材</em>
        </span>
      </section>

      {uploadReceipt.status !== 'idle' && (
        <UploadReceiptPanel receipt={uploadReceipt} onCancel={onCancelUpload} onRetry={onRetryUpload} />
      )}

      <div className="asset-picker-filters" aria-label="资产分类">
        {visibleAssetFilters.map((filter) => (
          <button
            type="button"
            key={filter}
            className={assetFilter === filter ? 'is-selected' : ''}
            onClick={() => setAssetFilter(filter)}
          >
            <span>{filter}</span>
            <em>{getFilterCount(filter)}</em>
          </button>
        ))}
      </div>

      <section className="asset-picker-grid">
        <input
          className="file-input"
          id="asset-picker-upload"
          type="file"
          accept="image/*"
          onChange={handlePickerUpload}
        />
        <label className="asset-picker-upload" htmlFor="asset-picker-upload">
          <Upload size={28} />
          <strong>上传图片</strong>
          <span>PNG / JPG / WebP，自动加入资产库</span>
        </label>

        {visibleAssets.map((asset) => {
          const canSelect = canUseAssetForGeneration(asset)
          const isSelected = selectedAssetId === asset.id

          return (
            <article
              className={[
                'asset-picker-card',
                isSelected ? 'is-selected' : '',
                canSelect ? '' : 'is-disabled',
              ]
                .filter(Boolean)
                .join(' ')}
              key={asset.id}
            >
              <button type="button" className="asset-picker-media" onClick={() => onPreview(asset.name, asset.image)}>
                <img src={asset.image} alt={asset.name} />
                <span>{asset.kind === 'video' ? '视频预览' : '图片预览'}</span>
                {isSelected && (
                  <i className="asset-picker-selected-mark">
                    <CheckCircle2 size={14} />
                  </i>
                )}
                {asset.kind === 'video' && (
                  <i className="asset-picker-play-mark">
                    <Play size={14} fill="currentColor" />
                  </i>
                )}
              </button>
              <div className="asset-picker-copy">
                <strong title={asset.name}>{asset.name}</strong>
                <span>
                  {asset.type} · {asset.expires}
                </span>
              </div>
              <div className="asset-picker-actions">
                <em>{asset.kind === 'video' ? '视频素材' : '图片素材'}</em>
                <button type="button" disabled={!canSelect || isSelected} onClick={() => onSelect(asset.id)}>
                  {isSelected ? '当前使用' : canSelect ? '选择图片' : '不适用当前模板'}
                </button>
              </div>
            </article>
          )
        })}
      </section>

      {visibleAssets.length === 0 && (
        <section className="asset-picker-empty">
          <Images size={22} />
          <strong>{assetFilterEmptyText(assetFilter)}</strong>
          <span>可以使用左上角上传入口补充新素材。</span>
        </section>
      )}
    </div>
  )
}
