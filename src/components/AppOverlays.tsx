import type {
  Asset,
  AssetFilter,
  AuthMode,
  LedgerRow,
  OverlayType,
  PaymentOrder,
  PaymentOrderStatus,
  PreviewMedia,
  QrLoginSession,
  QrLoginStatus,
  RechargePackage,
  SignupRewardStatus,
  Task,
  Template,
  ToastState,
  UploadReceipt,
} from '../types'
import { AssetPicker } from './AssetPicker'
import { AuthPanel } from './AuthPanel'
import { CreditPanel } from './CreditPanel'
import { Modal, Drawer, Sheet, Lightbox, Toast } from './OverlayPrimitives'
import { TaskDetail } from './TaskDetail'
import { FilterPanel, TemplateDetail } from './TemplatesView'

type AppOverlaysProps = {
  assetFilters: AssetFilter[]
  assets: Asset[]
  authMode: AuthMode
  creditBalance: number
  frozenCredits: number
  ledgerRows: LedgerRow[]
  overlay: OverlayType
  paymentOrder: PaymentOrder
  previewMedia: PreviewMedia
  rechargePackages: RechargePackage[]
  qrLoginSession: QrLoginSession
  selectedAssetId: string
  selectedFilters: string[]
  selectedTask: Task
  selectedTemplate: Template
  signupRewardStatus: SignupRewardStatus
  toast: ToastState
  uploadReceipt: UploadReceipt
  onAdvanceTask: (taskId: string) => void
  onApplyFilters: () => void
  onAuthModeChange: (mode: AuthMode) => void
  onCancelUpload: () => void
  onClearFilters: () => void
  onCloseOverlay: () => void
  onCloseToast: () => void
  onCreateFromTemplate: (templateId: string) => void
  onCreatePaymentOrder: (pack: RechargePackage) => void
  onDownloadTask: (taskId: string) => void
  onGrantSignupCredits: () => void
  onOpenAssetLibrary: () => void
  onPreview: (title: string, image: string, media?: Partial<Pick<PreviewMedia, 'kind' | 'videoSrc'>>) => void
  onQrRefresh: () => void
  onQrStatusChange: (status: QrLoginStatus) => void
  onRefundTask: (taskId: string) => void
  onResolvePaymentOrder: (status: Extract<PaymentOrderStatus, 'paid' | 'failed' | 'cancelled' | 'expired'>) => void
  onRetryUpload: () => void
  onSelectAsset: (assetId: string) => void
  onToast: (toast: ToastState) => void
  onToggleFilter: (filter: string) => void
  onUploadAsset: (file: File) => void
}

export function AppOverlays({
  assetFilters,
  assets,
  authMode,
  creditBalance,
  frozenCredits,
  ledgerRows,
  overlay,
  paymentOrder,
  previewMedia,
  rechargePackages,
  qrLoginSession,
  selectedAssetId,
  selectedFilters,
  selectedTask,
  selectedTemplate,
  signupRewardStatus,
  toast,
  uploadReceipt,
  onAdvanceTask,
  onApplyFilters,
  onAuthModeChange,
  onCancelUpload,
  onClearFilters,
  onCloseOverlay,
  onCloseToast,
  onCreateFromTemplate,
  onCreatePaymentOrder,
  onDownloadTask,
  onGrantSignupCredits,
  onOpenAssetLibrary,
  onPreview,
  onQrRefresh,
  onQrStatusChange,
  onRefundTask,
  onResolvePaymentOrder,
  onRetryUpload,
  onSelectAsset,
  onToast,
  onToggleFilter,
  onUploadAsset,
}: AppOverlaysProps) {
  return (
    <>
      {overlay === 'template' && (
        <Modal title="模板详情" onClose={onCloseOverlay}>
          <TemplateDetail
            template={selectedTemplate}
            onCreate={() => onCreateFromTemplate(selectedTemplate.id)}
            onPreview={() =>
              onPreview(selectedTemplate.title, selectedTemplate.image, {
                kind: selectedTemplate.videoSrc ? 'video' : 'image',
                videoSrc: selectedTemplate.videoSrc,
              })
            }
          />
        </Modal>
      )}
      {overlay === 'task' && (
        <Drawer title="作品详情" onClose={onCloseOverlay}>
          <TaskDetail
            task={selectedTask}
            onAdvance={onAdvanceTask}
            onDownload={() => onDownloadTask(selectedTask.id)}
            onOpenAssets={onOpenAssetLibrary}
            onPreview={() =>
              onPreview(
                selectedTask.title,
                selectedTask.image,
                selectedTask.status === 'success' ? { kind: 'video', videoSrc: selectedTask.videoSrc } : undefined,
              )
            }
            onRefund={onRefundTask}
          />
        </Drawer>
      )}
      {overlay === 'credits' && (
        <Drawer title="积分中心" onClose={onCloseOverlay}>
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
        </Drawer>
      )}
      {overlay === 'auth' && (
        <Modal title={authMode === 'register' ? '注册领取积分' : '登录方式'} onClose={onCloseOverlay} size="small">
          <AuthPanel
            mode={authMode}
            onGrantSignupCredits={onGrantSignupCredits}
            onModeChange={onAuthModeChange}
            onQrRefresh={onQrRefresh}
            onQrStatusChange={onQrStatusChange}
            onToast={onToast}
            qrLoginSession={qrLoginSession}
            signupRewardStatus={signupRewardStatus}
          />
        </Modal>
      )}
      {overlay === 'filters' && (
        <Sheet title="筛选模板" onClose={onCloseOverlay}>
          <FilterPanel
            selectedFilters={selectedFilters}
            onApply={onApplyFilters}
            onClear={onClearFilters}
            onToggle={onToggleFilter}
          />
        </Sheet>
      )}
      {overlay === 'assetPicker' && (
        <Modal title="选择商品图" onClose={onCloseOverlay}>
          <AssetPicker
            assets={assets}
            assetFilters={assetFilters}
            selectedAssetId={selectedAssetId}
            uploadReceipt={uploadReceipt}
            onCancelUpload={onCancelUpload}
            onPreview={onPreview}
            onRetryUpload={onRetryUpload}
            onSelect={onSelectAsset}
            onUpload={onUploadAsset}
          />
        </Modal>
      )}
      {overlay === 'lightbox' && (
        <Lightbox
          title={previewMedia.title}
          image={previewMedia.image}
          kind={previewMedia.kind}
          videoSrc={previewMedia.videoSrc}
          onClose={onCloseOverlay}
        />
      )}
      {toast && <Toast toast={toast} onClose={onCloseToast} />}
    </>
  )
}
