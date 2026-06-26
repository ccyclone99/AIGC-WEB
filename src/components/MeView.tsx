import { useState, type ChangeEvent, type FormEvent } from 'react'
import {
  Archive,
  Coins,
  Download,
  Gift,
  Library,
  PencilLine,
  QrCode,
  RefreshCcw,
  ShieldCheck,
  TimerReset,
  Trash2,
  Upload,
  UserRound,
  X,
} from 'lucide-react'

import { canUseAssetForGeneration, filterAssetByCategory, isExpiringAsset } from '../domain'
import type {
  Asset,
  AssetFilter,
  AuthMode,
  LedgerRow,
  PaymentOrder,
  PaymentOrderStatus,
  QrLoginSession,
  QrLoginStatus,
  RechargePackage,
  SignupRewardStatus,
  ToastState,
  UploadReceipt,
} from '../types'
import { assetFilterEmptyText } from '../viewModels'
import { AuthPanel } from './AuthPanel'
import { CreditPanel } from './CreditPanel'
import { PageTitle } from './PageTitle'
import { UploadReceiptPanel } from './UploadReceiptPanel'

type MeViewProps = {
  assets: Asset[]
  assetFilters: AssetFilter[]
  creditBalance: number
  customAssetFilters: AssetFilter[]
  frozenCredits: number
  ledgerRows: LedgerRow[]
  paymentOrder: PaymentOrder
  qrLoginSession: QrLoginSession
  signupRewardStatus: SignupRewardStatus
  uploadReceipt: UploadReceipt
  onArchiveAsset: (assetId: string) => void
  onCancelUpload: () => void
  onCreateAssetCategory: (name: string) => boolean
  onCreatePaymentOrder: (pack: RechargePackage) => void
  onDeleteAssetCategory: (name: string) => void
  onDownloadAsset: (assetId: string) => void
  onGrantSignupCredits: () => void
  onPreview: (title: string, image: string) => void
  onQrRefresh: () => void
  onQrStatusChange: (status: QrLoginStatus) => void
  onRenameAsset: (assetId: string) => void
  onResolvePaymentOrder: (status: Extract<PaymentOrderStatus, 'paid' | 'failed' | 'cancelled' | 'expired'>) => void
  onRestoreAsset: (assetId: string) => void
  onRetryUpload: () => void
  onReuseAsset: (assetId: string) => void
  onToast: (toast: ToastState) => void
  onUpdateAssetCategory: (assetId: string, category: string) => void
  onUploadAsset: (file: File) => void
}

type MeTab = 'assets' | 'credits' | 'account'

export function MeView({
  assets,
  assetFilters,
  creditBalance,
  customAssetFilters,
  frozenCredits,
  ledgerRows,
  paymentOrder,
  qrLoginSession,
  signupRewardStatus,
  uploadReceipt,
  onArchiveAsset,
  onCancelUpload,
  onCreateAssetCategory,
  onCreatePaymentOrder,
  onDeleteAssetCategory,
  onDownloadAsset,
  onGrantSignupCredits,
  onPreview,
  onQrRefresh,
  onQrStatusChange,
  onRenameAsset,
  onResolvePaymentOrder,
  onRestoreAsset,
  onRetryUpload,
  onReuseAsset,
  onToast,
  onUpdateAssetCategory,
  onUploadAsset,
}: MeViewProps) {
  const [activeTab, setActiveTab] = useState<MeTab>('assets')
  const [assetFilter, setAssetFilter] = useState<AssetFilter>('全部')
  const [accountAuthMode, setAccountAuthMode] = useState<AuthMode>('login')
  const [newCategoryName, setNewCategoryName] = useState('')
  const activeAssets = assets.filter((asset) => asset.status === 'library')
  const archivedAssets = assets.filter((asset) => asset.status === 'archived')
  const imageAssetCount = activeAssets.filter((asset) => ['image', 'portrait', 'logo'].includes(asset.kind)).length
  const videoAssetCount = activeAssets.filter((asset) => asset.kind === 'video').length
  const expiringAssetCount = activeAssets.filter(isExpiringAsset).length
  const visibleAssets = assets.filter((asset) => filterAssetByCategory(asset, assetFilter))
  const categoryOptions = assetFilters.filter((filter) => !['全部', '即将过期', '已归档'].includes(filter))
  const tabs: Array<{ id: MeTab; label: string; count: string }> = [
    { id: 'assets', label: '资产', count: `${activeAssets.length}` },
    { id: 'credits', label: '积分', count: creditBalance.toLocaleString() },
    { id: 'account', label: '账号', count: '登录' },
  ]
  const getTabId = (tab: MeTab) => `me-${tab}-tab`
  const getTabPanelId = (tab: MeTab) => `me-${tab}-panel`
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
    <div className="page-stack account-page">
      <PageTitle eyebrow="MY SPACE" title="我的" text="资产库、积分中心和账号状态集中在个人空间。" />
      <section className="me-overview-grid">
        <button type="button" className="me-card" onClick={() => setActiveTab('credits')}>
          <Coins size={22} />
          <strong>积分余额</strong>
          <span>{creditBalance.toLocaleString()} 可用，{frozenCredits} 冻结</span>
        </button>
        <button type="button" className="me-card" onClick={() => setActiveTab('assets')}>
          <Library size={22} />
          <strong>资产库</strong>
          <span>{activeAssets.length} 个可用，{archivedAssets.length} 个已归档</span>
        </button>
        <button type="button" className="me-card" onClick={() => setActiveTab('account')}>
          <Gift size={22} />
          <strong>登录与注册</strong>
          <span>支持扫码、第三方账号和注册赠送积分</span>
        </button>
      </section>

      <section className="me-tabs-shell">
        <div className="me-tabs" role="tablist" aria-label="我的页面分类">
          {tabs.map((tab) => (
            <button
              type="button"
              key={tab.id}
              className={activeTab === tab.id ? 'is-selected' : ''}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={getTabPanelId(tab.id)}
              id={getTabId(tab.id)}
              onClick={() => setActiveTab(tab.id)}
            >
              <strong>{tab.label}</strong>
              <span>{tab.count}</span>
            </button>
          ))}
        </div>

        {activeTab === 'assets' && (
          <section className="me-tab-panel asset-manager" id={getTabPanelId('assets')} role="tabpanel" aria-labelledby={getTabId('assets')}>
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
                      <small>{asset.source} · {asset.expires}</small>
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
                      <button type="button" onClick={() => onDownloadAsset(asset.id)}>
                        <Download size={15} />
                        下载
                      </button>
                      <button type="button" onClick={() => onRenameAsset(asset.id)}>
                        <PencilLine size={15} />
                        重命名
                      </button>
                      <button type="button" disabled={!canReuse} onClick={() => onReuseAsset(asset.id)}>
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
        )}

        {activeTab === 'credits' && (
          <section className="me-tab-panel credits-tab-panel" id={getTabPanelId('credits')} role="tabpanel" aria-labelledby={getTabId('credits')}>
            <CreditPanel
              balance={creditBalance}
              frozenCredits={frozenCredits}
              ledgerRows={ledgerRows}
              paymentOrder={paymentOrder}
              onCreatePaymentOrder={onCreatePaymentOrder}
              onResolvePaymentOrder={onResolvePaymentOrder}
              onToast={onToast}
            />
          </section>
        )}

        {activeTab === 'account' && (
          <section className="me-tab-panel account-tab-panel" id={getTabPanelId('account')} role="tabpanel" aria-labelledby={getTabId('account')}>
            <AuthPanel
              mode={accountAuthMode}
              onGrantSignupCredits={onGrantSignupCredits}
              onModeChange={setAccountAuthMode}
              onQrRefresh={onQrRefresh}
              onQrStatusChange={onQrStatusChange}
              onToast={onToast}
              qrLoginSession={qrLoginSession}
              signupRewardStatus={signupRewardStatus}
            />
            <div className="account-binding-panel">
              <strong>账号安全与绑定</strong>
              <div>
                <span>
                  <ShieldCheck size={16} />
                  手机号校验
                </span>
                <span>
                  <QrCode size={16} />
                  微信扫码
                </span>
                <span>
                  <UserRound size={16} />
                  第三方账号
                </span>
              </div>
              <p>注册赠送积分会叠加设备、IP、手机号、支付行为和活动规则，防止重复领取。</p>
            </div>
          </section>
        )}
      </section>
    </div>
  )
}
