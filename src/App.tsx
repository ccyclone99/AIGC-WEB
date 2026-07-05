import { useEffect } from 'react'
import './App.css'

import { AppOverlays } from './components/AppOverlays'
import { HomeView } from './components/HomeView'
import { MeView } from './components/MeView'
import { StudioPage } from './components/StudioPage'
import { TasksView } from './components/TasksView'
import { TemplatesView } from './components/TemplatesView'
import { TopBar } from './components/TopBar'
import { WorkbenchView } from './components/WorkbenchView'
import { usePrototypeStore } from './hooks/usePrototypeStore'

function App() {
  const store = usePrototypeStore()

  useEffect(() => {
    window.scrollTo({ left: 0, top: 0 })
  }, [store.activeView, store.workbenchMode])

  return (
    <main className="app-shell">
      <TopBar activeView={store.activeView} creditBalance={store.creditBalance} onCredits={store.openCredits} onNavigate={store.goToView} />

      {store.activeView === 'home' && (
        <HomeView
          onAuth={store.openAuth}
          onNavigate={store.goToView}
          onOpenTemplate={store.openTemplate}
          onPreview={store.openPreview}
          onStartMaking={store.openStudio}
        />
      )}
      {store.activeView === 'workbench' &&
        (store.workbenchMode === 'create' ? (
          <StudioPage
            assets={store.demoAssets}
            creditBalance={store.creditBalance}
            outputSettings={store.outputSettings}
            selectedAssetId={store.selectedStudioAssetId}
            tasks={store.demoTasks}
            template={store.selectedStudioTemplate}
            onAssetSelect={store.selectStudioAsset}
            onCredits={store.openCredits}
            onOpenAssetPicker={store.openAssetPicker}
            onOpenTask={store.openTask}
            onOutputSettingChange={store.updateOutputSetting}
            onPreview={store.openPreview}
            onSubmit={store.submitBatchGeneration}
          />
        ) : (
          <WorkbenchView
            assets={store.demoAssets}
            creditBalance={store.creditBalance}
            frozenCredits={store.frozenCredits}
            tasks={store.demoTasks}
            onCredits={store.openCredits}
            onNavigate={store.goToView}
            onOpenTask={store.openTask}
            onOpenTemplate={store.openTemplate}
            onPreview={store.openPreview}
            onStartMaking={store.openStudio}
          />
        ))}
      {store.activeView === 'templates' && (
        <TemplatesView
          searchTerm={store.searchTerm}
          selectedFilters={store.selectedFilters}
          templates={store.filteredTemplates}
          onClearFilters={store.clearFilters}
          onFilter={store.openFilters}
          onOpenTemplate={store.openTemplate}
          onPreview={store.previewFeaturedTemplate}
          onSearch={store.setSearchTerm}
          onToggleFilter={store.toggleFilter}
        />
      )}
      {store.activeView === 'tasks' && <TasksView tasks={store.demoTasks} onOpenTask={store.openTask} />}
      {store.activeView === 'me' && (
        <MeView
          assets={store.demoAssets}
          assetFilters={store.assetFilters}
          creditBalance={store.creditBalance}
          customAssetFilters={store.customAssetFilters}
          frozenCredits={store.frozenCredits}
          ledgerRows={store.demoLedgerRows}
          paymentOrder={store.paymentOrder}
          qrLoginSession={store.qrLoginSession}
          rechargePackages={store.rechargePackages}
          signupRewardStatus={store.signupRewardStatus}
          uploadReceipt={store.uploadReceipt}
          onArchiveAsset={store.archiveAsset}
          onCancelUpload={store.cancelUpload}
          onCreateAssetCategory={store.createAssetCategory}
          onCreatePaymentOrder={store.createPaymentOrder}
          onDeleteAssetCategory={store.deleteAssetCategory}
          onDownloadAsset={store.downloadAsset}
          onGrantSignupCredits={store.grantSignupCredits}
          onPreview={store.openPreview}
          onQrRefresh={store.refreshQrLoginSession}
          onQrStatusChange={store.updateQrLoginStatus}
          onRenameAsset={store.renameAsset}
          onResolvePaymentOrder={store.resolvePaymentOrder}
          onRestoreAsset={store.restoreAsset}
          onRetryUpload={store.retryUpload}
          onReuseAsset={store.reuseAsset}
          onToast={store.setToast}
          onUpdateAssetCategory={store.updateAssetCategory}
          onUploadAsset={store.uploadLibraryAsset}
        />
      )}

      <AppOverlays
        assetFilters={store.assetFilters}
        assets={store.demoAssets}
        authMode={store.authMode}
        creditBalance={store.creditBalance}
        frozenCredits={store.frozenCredits}
        ledgerRows={store.demoLedgerRows}
        overlay={store.overlay}
        paymentOrder={store.paymentOrder}
        previewMedia={store.previewMedia}
        rechargePackages={store.rechargePackages}
        qrLoginSession={store.qrLoginSession}
        selectedAssetId={store.selectedStudioAssetId}
        selectedFilters={store.selectedFilters}
        selectedTask={store.selectedTask}
        selectedTemplate={store.selectedTemplate}
        signupRewardStatus={store.signupRewardStatus}
        toast={store.toast}
        uploadReceipt={store.uploadReceipt}
        onAdvanceTask={store.advanceTask}
        onApplyFilters={store.applyTemplateFilters}
        onAuthModeChange={store.setAuthMode}
        onCancelUpload={store.cancelUpload}
        onClearFilters={store.clearFilters}
        onCloseOverlay={store.closeOverlay}
        onCloseToast={store.closeToast}
        onCreateFromTemplate={store.openStudio}
        onCreatePaymentOrder={store.createPaymentOrder}
        onDownloadTask={store.downloadTaskResult}
        onGrantSignupCredits={store.grantSignupCredits}
        onOpenAssetLibrary={store.openAssetLibrary}
        onPreview={store.openPreview}
        onQrRefresh={store.refreshQrLoginSession}
        onQrStatusChange={store.updateQrLoginStatus}
        onRefundTask={store.refundTask}
        onResolvePaymentOrder={store.resolvePaymentOrder}
        onRetryUpload={store.retryUpload}
        onSelectAsset={store.selectAssetFromPicker}
        onToast={store.setToast}
        onToggleFilter={store.toggleFilter}
        onUploadAsset={store.uploadStudioAsset}
      />
    </main>
  )
}

export default App
