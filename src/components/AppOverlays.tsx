import type {
  AccountSection,
  Asset,
  AssetFilter,
  AssetKind,
  AuthMode,
  LedgerRow,
  OverlayType,
  PaymentOrder,
  PaymentOrderStatus,
  PreviewMedia,
  QrLoginSession,
  QrLoginStatus,
  RechargePackage,
  SessionState,
  SignupRewardStatus,
  Task,
  Template,
  ToastState,
  UploadReceipt,
} from '../types'
import { AssetPicker } from './AssetPicker'
import { AccountSettingsPanel } from './AccountSettingsPanel'
import { AuthPanel } from './AuthPanel'
import { CreditPanel } from './CreditPanel'
import { Modal, Drawer, Sheet, Lightbox, Toast } from './OverlayPrimitives'
import { TaskDetail } from './TaskDetail'
import { TemplatePicker } from './TemplatePicker'
import { FilterPanel, TemplateDetail } from './TemplatesView'

type AppOverlaysProps = {
  accountSection: AccountSection
  assetFilters: AssetFilter[]
  assets: Asset[]
  authMode: AuthMode
  creditBalance: number
  frozenCredits: number
  isPrototype: boolean
  ledgerRows: LedgerRow[]
  overlay: OverlayType
  paymentOrder: PaymentOrder
  previewMedia: PreviewMedia
  rechargePackages: RechargePackage[]
  session: SessionState
  qrLoginSession: QrLoginSession
  selectedAssetId: string
  selectedFilters: string[]
  selectedTask: Task
  selectedTemplate: Template
  studioTemplate: Template
  templates: Template[]
  signupRewardStatus: SignupRewardStatus
  toast: ToastState
  uploadReceipt: UploadReceipt
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
  onLogout: () => void
  onOpenAssetLibrary: () => void
  onPreview: (title: string, image: string, media?: Partial<Pick<PreviewMedia, 'kind' | 'videoSrc'>>) => void
  onQrRefresh: () => void
  onQrStatusChange: (status: QrLoginStatus) => void
  onResolvePaymentOrder: (status: Extract<PaymentOrderStatus, 'paid' | 'failed' | 'cancelled' | 'expired'>) => void
  onRetryUpload: () => void
  onSelectAsset: (assetId: string) => void
  onSelectTemplate: (templateId: string) => void
  onToast: (toast: ToastState) => void
  onToggleFilter: (filter: string) => void
  onUploadAsset: (file: File, kind: AssetKind) => void
}

export function AppOverlays({
  accountSection,
  assetFilters,
  assets,
  authMode,
  creditBalance,
  frozenCredits,
  isPrototype,
  ledgerRows,
  overlay,
  paymentOrder,
  previewMedia,
  rechargePackages,
  session,
  qrLoginSession,
  selectedAssetId,
  selectedFilters,
  selectedTask,
  selectedTemplate,
  studioTemplate,
  templates,
  signupRewardStatus,
  toast,
  uploadReceipt,
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
  onLogout,
  onOpenAssetLibrary,
  onPreview,
  onQrRefresh,
  onQrStatusChange,
  onResolvePaymentOrder,
  onRetryUpload,
  onSelectAsset,
  onSelectTemplate,
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
        <Drawer title="生成详情" onClose={onCloseOverlay}>
          <TaskDetail
            task={selectedTask}
            onDownload={() => onDownloadTask(selectedTask.id)}
            onOpenAssets={onOpenAssetLibrary}
            onPreview={() =>
              onPreview(
                selectedTask.title,
                selectedTask.image,
                selectedTask.status === 'success' ? { kind: 'video', videoSrc: selectedTask.videoSrc } : undefined,
              )
            }
          />
        </Drawer>
      )}
      {overlay === 'templatePicker' && (
        <Drawer title="更换模板" onClose={onCloseOverlay}>
          <TemplatePicker
            templates={templates}
            selectedAsset={assets.find((asset) => asset.id === selectedAssetId)}
            selectedTemplateId={studioTemplate.id}
            onSelect={onSelectTemplate}
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
      {overlay === 'account' && (
        <Drawer title="账号" onClose={onCloseOverlay}>
          <AccountSettingsPanel section={accountSection} session={session} onToast={onToast} />
        </Drawer>
      )}
      {overlay === 'auth' && (
        <Modal title={authMode === 'register' ? '注册领取积分' : '登录方式'} onClose={onCloseOverlay} size="small">
          <AuthPanel
            mode={authMode}
            isPrototype={isPrototype}
            session={session}
            onGrantSignupCredits={onGrantSignupCredits}
            onLogout={onLogout}
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
        <Modal title={`选择${studioTemplate.config.inputFields[0]?.label ?? '图片'}`} onClose={onCloseOverlay}>
          <AssetPicker
            acceptedKinds={studioTemplate.config.inputFields[0]?.acceptedKinds ?? ['image']}
            assets={assets}
            assetFilters={assetFilters}
            inputLabel={studioTemplate.config.inputFields[0]?.label ?? '图片'}
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
