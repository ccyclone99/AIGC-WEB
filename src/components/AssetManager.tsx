import { useState, type ChangeEvent, type FormEvent } from 'react'
import {
  Download,
  Library,
  MoreHorizontal,
  PencilLine,
  Play,
  RefreshCcw,
  Trash2,
  Upload,
  X,
} from 'lucide-react'

import { canUseAssetForGeneration, filterAssetByCategory } from '../domain'
import type { Asset, AssetFilter, PreviewMedia, UploadReceipt } from '../types'
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
  onPreview: (title: string, image: string, media?: Partial<Pick<PreviewMedia, 'kind' | 'videoSrc'>>) => void
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
  const visibleAssets = assets.filter((asset) => filterAssetByCategory(asset, assetFilter))
  const visibleAssetFilters = assetFilters.filter(
    (filter) => filter === '全部' || assets.some((asset) => filterAssetByCategory(asset, filter)),
  )
  const categoryOptions = assetFilters.filter((filter) => !['全部', '即将过期', '已归档', '生成视频'].includes(filter))

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
          <strong>上传素材</strong>
          <small>{visibleAssets.length} 项</small>
        </span>
        <div className="asset-manager-actions">
          <details className="asset-category-manager">
            <summary>
              <Library size={16} />
              分类管理
              {customAssetFilters.length > 0 && <em>{customAssetFilters.length}</em>}
            </summary>
            <form className="asset-category-form" onSubmit={handleCategorySubmit}>
              <label>
                <span>新增分类</span>
                <input
                  value={newCategoryName}
                  maxLength={18}
                  placeholder="输入分类名称"
                  onChange={(event) => setNewCategoryName(event.currentTarget.value)}
                />
              </label>
              <button type="submit" className="secondary-action">
                添加
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
          </details>
          <input className="file-input" id="asset-library-upload" type="file" accept="image/*" onChange={handleLibraryUpload} />
          <label className="secondary-action upload-inline-button" htmlFor="asset-library-upload">
            <Upload size={17} />
            上传图片
          </label>
        </div>
      </div>
      <UploadReceiptPanel receipt={uploadReceipt} onCancel={onCancelUpload} onRetry={onRetryUpload} />

      <div className="asset-filter-row">
        {visibleAssetFilters.map((filter) => (
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

      <div className="asset-management-grid">
        {visibleAssets.map((asset) => {
          const canReuse = canUseAssetForGeneration(asset)

          return (
            <article className={asset.status === 'archived' ? 'asset-manage-card is-archived' : 'asset-manage-card'} key={asset.id}>
              <button
                type="button"
                className="asset-manage-media"
                onClick={() =>
                  onPreview(
                    asset.name,
                    asset.image,
                    asset.kind === 'video' ? { kind: 'video', videoSrc: asset.videoSrc } : undefined,
                  )
                }
              >
                <img src={asset.image} alt={asset.name} />
                <span>{asset.type}</span>
              </button>
              <div className="asset-manage-copy">
                <div className="asset-title-row">
                  <strong>{asset.name}</strong>
                </div>
                <small>{asset.type} · {asset.expires}</small>
              </div>
              <div className="asset-action-grid">
                <button type="button" onClick={() => onDownloadAsset(asset.id)}>
                  <Download size={15} />
                  下载
                </button>
                {canReuse && (
                  <button type="button" className="asset-primary-action" onClick={() => onReuseAsset(asset.id)}>
                    <RefreshCcw size={15} />
                    用于创作
                  </button>
                )}
                {!canReuse && (
                  <button type="button" className="asset-primary-action" onClick={() => onPreview(asset.name, asset.image, { kind: 'video', videoSrc: asset.videoSrc })}>
                    <Play size={15} />
                    预览
                  </button>
                )}
                <details className="asset-more-actions">
                  <summary aria-label="更多操作">
                    <MoreHorizontal size={16} />
                    更多
                  </summary>
                  <div>
                    <button type="button" onClick={() => onRenameAsset(asset.id)}>
                      <PencilLine size={15} />
                      重命名
                    </button>
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
                </details>
              </div>
            </article>
          )
        })}
      </div>
      {visibleAssets.length === 0 && <p className="empty-inline">{assetFilterEmptyText(assetFilter)}</p>}
    </section>
  )
}
