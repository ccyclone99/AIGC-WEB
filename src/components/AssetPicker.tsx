import { CheckCircle2, Images, Upload } from 'lucide-react'
import { useState, type ChangeEvent } from 'react'

import { filterAssetByCategory } from '../domain'
import type { Asset, AssetFilter, AssetKind, PreviewMedia, UploadReceipt } from '../types'
import { assetFilterEmptyText } from '../viewModels'
import { UploadReceiptPanel } from './UploadReceiptPanel'

type AssetPickerProps = {
  assets: Asset[]
  acceptedKinds: AssetKind[]
  assetFilters: AssetFilter[]
  inputLabel: string
  selectedAssetId: string
  uploadReceipt: UploadReceipt
  onCancelUpload: () => void
  onPreview: (title: string, image: string, media?: Partial<Pick<PreviewMedia, 'kind' | 'videoSrc'>>) => void
  onRetryUpload: () => void
  onSelect: (assetId: string) => void
  onUpload: (file: File, kind: AssetKind) => void
}

export function AssetPicker({
  assets,
  acceptedKinds,
  assetFilters,
  inputLabel,
  selectedAssetId,
  uploadReceipt,
  onCancelUpload,
  onPreview,
  onRetryUpload,
  onSelect,
  onUpload,
}: AssetPickerProps) {
  const [assetFilter, setAssetFilter] = useState<AssetFilter>('全部')
  const canUseAsset = (asset: Asset) => asset.status === 'library' && acceptedKinds.includes(asset.kind)
  const usableAssetCount = assets.filter(canUseAsset).length
  const getFilterCount = (filter: AssetFilter) =>
    assets.filter((asset) => canUseAsset(asset) && filterAssetByCategory(asset, filter)).length
  const visibleAssetFilters = assetFilters.filter((filter) => filter === '全部' || getFilterCount(filter) > 0)
  const visibleAssets = assets
    .filter(canUseAsset)
    .filter((asset) => filterAssetByCategory(asset, assetFilter))
  const uploadKind = acceptedKinds[0] ?? 'image'
  const acceptsVideo = acceptedKinds.includes('video')

  const handlePickerUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0]
    if (file) onUpload(file, uploadKind)
    event.currentTarget.value = ''
  }

  return (
    <div className="asset-picker">
      <header className="asset-picker-head">
        <div>
          <p className="eyebrow">选择{inputLabel}</p>
          <strong>从已有素材中选择，或上传一份新素材。</strong>
        </div>
        <span>{usableAssetCount} 份可用素材</span>
      </header>

      {uploadReceipt.status !== 'idle' && (
        <UploadReceiptPanel receipt={uploadReceipt} onCancel={onCancelUpload} onRetry={onRetryUpload} />
      )}

      <div className="asset-picker-filters" aria-label="素材分类">
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
          accept={acceptsVideo ? 'video/*' : 'image/*'}
          onChange={handlePickerUpload}
        />
        <label className="asset-picker-upload" htmlFor="asset-picker-upload">
          <Upload size={28} />
          <strong>上传{inputLabel}</strong>
          <span>{acceptsVideo ? 'MP4 / MOV' : 'PNG / JPG / WebP'}，上传后自动保存</span>
        </label>

        {visibleAssets.map((asset) => {
          const isSelected = selectedAssetId === asset.id

          return (
            <article
              className={[
                'asset-picker-card',
                isSelected ? 'is-selected' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              key={asset.id}
            >
              <button
                type="button"
                className="asset-picker-media"
                onClick={() =>
                  onPreview(
                    asset.name,
                    asset.image,
                    undefined,
                  )
                }
              >
                <img src={asset.image} alt={asset.name} />
                <span>{asset.kind === 'video' ? '视频预览' : '图片预览'}</span>
                {isSelected && (
                  <i className="asset-picker-selected-mark">
                    <CheckCircle2 size={14} />
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
                <button type="button" disabled={isSelected} onClick={() => onSelect(asset.id)}>
                  {isSelected ? '当前使用' : `选择${inputLabel}`}
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
          <span>可以先上传一份符合模板要求的素材。</span>
        </section>
      )}
    </div>
  )
}
