import { useState } from 'react'
import { Coins, Gift, Library, ShieldCheck } from 'lucide-react'

import type {
  Asset,
  AssetFilter,
  LedgerRow,
  PaymentOrder,
  PaymentOrderStatus,
  PreviewMedia,
  QrLoginSession,
  QrLoginStatus,
  RechargePackage,
  SignupRewardStatus,
  ToastState,
  UploadReceipt,
} from '../types'
import { AccountPanel } from './AccountPanel'
import { AssetManager } from './AssetManager'
import { CreditPanel } from './CreditPanel'

type MeViewProps = {
  assets: Asset[]
  assetFilters: AssetFilter[]
  creditBalance: number
  customAssetFilters: AssetFilter[]
  frozenCredits: number
  ledgerRows: LedgerRow[]
  paymentOrder: PaymentOrder
  qrLoginSession: QrLoginSession
  rechargePackages: RechargePackage[]
  signupRewardStatus: SignupRewardStatus
  uploadReceipt: UploadReceipt
  onArchiveAsset: (assetId: string) => void
  onCancelUpload: () => void
  onCreateAssetCategory: (name: string) => boolean
  onCreatePaymentOrder: (pack: RechargePackage) => void
  onDeleteAssetCategory: (name: string) => void
  onDownloadAsset: (assetId: string) => void
  onGrantSignupCredits: () => void
  onPreview: (title: string, image: string, media?: Partial<Pick<PreviewMedia, 'kind' | 'videoSrc'>>) => void
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

const tabIcons = {
  assets: Library,
  credits: Coins,
  account: ShieldCheck,
}

export function MeView({
  assets,
  assetFilters,
  creditBalance,
  customAssetFilters,
  frozenCredits,
  ledgerRows,
  paymentOrder,
  qrLoginSession,
  rechargePackages,
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
  const activeAssets = assets.filter((asset) => asset.status === 'library')
  const archivedAssets = assets.filter((asset) => asset.status === 'archived')
  const videoAssets = activeAssets.filter((asset) => asset.kind === 'video')
  const tabs: Array<{ id: MeTab; label: string; text: string; count: string }> = [
    { id: 'assets', label: '资产库', text: '图片、视频、分类', count: `${activeAssets.length}` },
    { id: 'credits', label: '积分中心', text: '充值、冻结、明细', count: creditBalance.toLocaleString() },
    { id: 'account', label: '账号安全', text: '扫码、第三方、活动', count: '登录' },
  ]
  const getTabId = (tab: MeTab) => `me-${tab}-tab`
  const getTabPanelId = (tab: MeTab) => `me-${tab}-panel`

  return (
    <div className="page-stack account-page me-console-page">
      <section className="me-console-head">
        <div>
          <p className="eyebrow">我的空间</p>
          <h1>资源与账号</h1>
          <p>资产库、积分明细和账号安全集中管理。创作过程只调用这里的可用素材和账户额度。</p>
        </div>
        <div className="me-console-kpis" aria-label="个人空间概览">
          <button type="button" onClick={() => setActiveTab('assets')}>
            <Library size={18} />
            <span>
              <strong>{activeAssets.length}</strong>
              可用资产
            </span>
          </button>
          <button type="button" onClick={() => setActiveTab('credits')}>
            <Coins size={18} />
            <span>
              <strong>{creditBalance.toLocaleString()}</strong>
              可用积分
            </span>
          </button>
          <button type="button" onClick={() => setActiveTab('account')}>
            <Gift size={18} />
            <span>
              <strong>{frozenCredits}</strong>
              冻结积分
            </span>
          </button>
        </div>
      </section>

      <section className="me-console-shell">
        <div className="me-console-tabs" role="tablist" aria-label="资源与账号分类">
          {tabs.map((tab) => {
            const TabIcon = tabIcons[tab.id]

            return (
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
                <TabIcon size={18} />
                <span>
                  <strong>{tab.label}</strong>
                  <small>{tab.text}</small>
                </span>
                <em>{tab.count}</em>
              </button>
            )
          })}
        </div>

        <div className="me-console-body">
          {activeTab === 'assets' && (
            <AssetManager
              assets={assets}
              assetFilters={assetFilters}
              customAssetFilters={customAssetFilters}
              labelledBy={getTabId('assets')}
              panelId={getTabPanelId('assets')}
              uploadReceipt={uploadReceipt}
              onArchiveAsset={onArchiveAsset}
              onCancelUpload={onCancelUpload}
              onCreateAssetCategory={onCreateAssetCategory}
              onDeleteAssetCategory={onDeleteAssetCategory}
              onDownloadAsset={onDownloadAsset}
              onPreview={onPreview}
              onRenameAsset={onRenameAsset}
              onRestoreAsset={onRestoreAsset}
              onRetryUpload={onRetryUpload}
              onReuseAsset={onReuseAsset}
              onUpdateAssetCategory={onUpdateAssetCategory}
              onUploadAsset={onUploadAsset}
            />
          )}

          {activeTab === 'credits' && (
            <section className="me-tab-panel credits-tab-panel" id={getTabPanelId('credits')} role="tabpanel" aria-labelledby={getTabId('credits')}>
              <CreditPanel
                balance={creditBalance}
                frozenCredits={frozenCredits}
                ledgerRows={ledgerRows}
                paymentOrder={paymentOrder}
                packages={rechargePackages}
                onCreatePaymentOrder={onCreatePaymentOrder}
                onResolvePaymentOrder={onResolvePaymentOrder}
                onToast={onToast}
              />
            </section>
          )}

          {activeTab === 'account' && (
            <AccountPanel
              labelledBy={getTabId('account')}
              panelId={getTabPanelId('account')}
              onGrantSignupCredits={onGrantSignupCredits}
              onQrRefresh={onQrRefresh}
              onQrStatusChange={onQrStatusChange}
              onToast={onToast}
              qrLoginSession={qrLoginSession}
              signupRewardStatus={signupRewardStatus}
            />
          )}
        </div>
      </section>

      <section className="me-console-note" aria-label="资产状态说明">
        <span>{videoAssets.length} 个生成视频</span>
        <span>{archivedAssets.length} 个已归档资产</span>
        <span>生成结果会自动保存到资产库</span>
      </section>
    </div>
  )
}
