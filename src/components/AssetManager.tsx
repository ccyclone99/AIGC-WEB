import { useState, type ChangeEvent, type FormEvent } from 'react'
import {
  Archive,
  Download,
  Library,
  PencilLine,
  RefreshCcw,
  TimerReset,
  Trash2,
  Upload,
  X,
} from 'lucide-react'

import { canUseAssetForGeneration, filterAssetByCategory, isExpiringAsset } from '../domain'
import type { Asset, AssetFilter, UploadReceipt } from '../types'
import { assetFilterEmptyText } from '../viewModels'
import { UploadReceiptPanel } from './UploadReceiptPanel'

type AssetManagerProps = {
  assets: Asset[]
  assetFilters: AssetFilter[]
  customAssetFilters: AssetFilter[]
  labelledBy: string
  panelId: string
  uploadReceipt: UploadReceipt
  onArchiveAsset: (assetId: string) => void
  onCancelUpload: () => void
  onCreateAssetCategory: (name: string) => boolean
  onDeleteAssetCategory: (name: string) => void
  onDownloadAsset: (assetId: string) => void
  onPreview: (title: string, image: string) => void
  onRenameAsset: (assetId: string) => void
  onRestoreAsset: (assetId: string) => void
  onRetryUpload: () => void
  onReuseAsset: (assetId: string) => void
  onUpdateAssetCategory: (assetId: string, category: string) => void
  onUploadAsset: (file: File) => void
}

export function AssetManager({
  assets,
  assetFilters,
  customAssetFilters,
  labelledBy,
  panelId,
  uploadReceipt,
  onArchiveAsset,
  onCancelUpload,
  onCreateAssetCategory,
  onDeleteAssetCategory,
  onDownloadAsset,
  onPreview,
  onRenameAsset,
  onRestoreAsset,
  onRetryUpload,
  onReuseAsset,
  onUpdateAssetCategory,
  onUploadAsset,
}: AssetManagerProps) {
  const [assetFilter, setAssetFilter] = useState<AssetFilter>('全部')
  const [newCategoryName, setNewCategoryName] = useState('')
  const activeAssets = assets.filter((asset) => asset.status === 'library')
  const imageAssetCount = activeAssets.filter((asset) => ['image', 'portrait', 'logo'].includes(asset.kind)).length
  const videoAssetCount = activeAssets.filter((asset) => asset.kind === 'video').length
  const expiringAssetCount = activeAssets.filter(isExpiringAsset).length
  const visibleAssets = assets.filter((asset) => filterAssetByCategory(asset, assetFilter))
  const categoryOptions = assetFilters.filter((filter) => !['全部', '即将过期', '已归档'].includes(filter))

  const handleLibraryUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0]
    if (file) onUploadAsset(file)
    event.currentTarget.value = ''
  }

  const handleCategorySubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (onCreateAssetCategory(newCategoryName)) {
      setAssetFilter(newCategoryName.trim().slice(0, 18))
      setNewCategoryName('')
    }
  }

  return (
    <section className="me-tab-panel asset-manager" id={panelId} role="tabpanel" aria-labelledby={labelledBy}>
      <div className="asset-manager-head">
        <span>
          <strong>资产管理</strong>
          <small>上传、复用、下载、重命名、分类和归档自己的素材。</small>
        </span>
        <input className="file-input" id="asset-library-upload" type="file" accept="image/*" onChange={handleLibraryUpload} />
        <label className="secondary-action upload-inline-button" htmlFor="asset-library-upload">
          <Upload size={17} />
          上传素材
        </label>
      </div>
      <UploadReceiptPanel receipt={uploadReceipt} onCancel={onCancelUpload} onRetry={onRetryUpload} />

      <div className="asset-filter-row">
        {assetFilters.map((filter) => (
          <button
            type="button"
            key={filter}
            className={assetFilter === filter ? 'is-selected' : ''}
            onClick={() => setAssetFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      <form className="asset-category-manager" onSubmit={handleCategorySubmit}>
        <label>
          <span>分类管理</span>
          <input
            value={newCategoryName}
            maxLength={18}
            placeholder="新增自定义分类"
            onChange={(event) => setNewCategoryName(event.currentTarget.value)}
          />
        </label>
        <button type="submit" className="secondary-action">
          <Library size={16} />
          添加分类
        </button>
        {customAssetFilters.length > 0 && (
          <div className="asset-custom-category-row">
            {customAssetFilters.map((filter) => (
              <button type="button" key={filter} onClick={() => onDeleteAssetCategory(filter)}>
                {filter}
                <X size={14} />
              </button>
            ))}
          </div>
        )}
      </form>

      <div className="asset-summary-row">
        <span>
          <strong>{imageAssetCount}</strong>
          图片素材
        </span>
        <span>
          <strong>{videoAssetCount}</strong>
          生成视频
        </span>
        <span>
          <strong>{expiringAssetCount}</strong>
          即将过期
        </span>
      </div>

      <div className="asset-management-grid">
        {visibleAssets.map((asset) => {
          const canReuse = canUseAssetForGeneration(asset)

          return (
            <article className={asset.status === 'archived' ? 'asset-manage-card is-archived' : 'asset-manage-card'} key={asset.id}>
              <button type="button" className="asset-manage-media" onClick={() => onPreview(asset.name, asset.image)}>
                <img src={asset.image} alt={asset.name} />
                <span>{asset.type}</span>
              </button>
              <div className="asset-manage-copy">
                <div className="asset-title-row">
                  <strong>{asset.name}</strong>
                  <em className={canReuse ? 'is-reusable' : 'is-output-only'}>{canReuse ? '可复用' : '仅下载'}</em>
                </div>
                <small>{asset.expires}</small>
                <label className="asset-category-select">
                  <span>分类</span>
                  <select value={asset.type} onChange={(event) => onUpdateAssetCategory(asset.id, event.currentTarget.value)}>
                    {categoryOptions.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="asset-state-row">
                  {isExpiringAsset(asset) && (
                    <em className="is-expiring">
                      <TimerReset size={14} />
                      即将过期
                    </em>
                  )}
                  {asset.status === 'archived' && (
                    <em>
                      <Archive size={14} />
                      已归档
                    </em>
                  )}
                </div>
                {!canReuse && <small className="asset-reuse-note">视频结果可下载或作为后续视频模板素材。</small>}
              </div>
              <div className="asset-action-grid">
                <button type="button" className={!canReuse ? 'asset-primary-action' : ''} onClick={() => onDownloadAsset(asset.id)}>
                  <Download size={15} />
                  下载
                </button>
                <button type="button" onClick={() => onRenameAsset(asset.id)}>
                  <PencilLine size={15} />
                  重命名
                </button>
                <button type="button" className={canReuse ? 'asset-primary-action' : ''} disabled={!canReuse} onClick={() => onReuseAsset(asset.id)}>
                  <RefreshCcw size={15} />
                  复用
                </button>
                {asset.status === 'archived' ? (
                  <button type="button" onClick={() => onRestoreAsset(asset.id)}>
                    <RefreshCcw size={15} />
                    恢复
                  </button>
                ) : (
                  <button type="button" className="danger-action" onClick={() => onArchiveAsset(asset.id)}>
                    <Trash2 size={15} />
                    归档
                  </button>
                )}
              </div>
            </article>
          )
        })}
      </div>
      {visibleAssets.length === 0 && <p className="empty-inline">{assetFilterEmptyText(assetFilter)}</p>}
    </section>
  )
}
