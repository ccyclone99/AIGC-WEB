import { useEffect } from 'react'
import './App.css'

import { AppOverlays } from './components/AppOverlays'
import { HomeView } from './components/HomeView'
import { StudioPage } from './components/StudioPage'
import { TemplateDiscovery } from './components/TemplateDiscovery'
import { TemplatesView } from './components/TemplatesView'
import { TopBar } from './components/TopBar'
import { WorksView } from './components/WorksView'
import { usePrototypeStore } from './hooks/usePrototypeStore'

function App() {
  const store = usePrototypeStore()

  useEffect(() => {
    window.scrollTo({ left: 0, top: 0 })
  }, [store.activeView, store.creationStage])

  return (
    <main className="app-shell">
      <TopBar
        activeView={store.activeView}
        creditBalance={store.creditBalance}
        newWorkCount={store.newWorkCount}
        session={store.session}
        tasks={store.demoTasks}
        onAccount={store.openAccount}
        onCredits={store.openCredits}
        onLogin={() => store.openAuth('login')}
        onLogout={store.logout}
        onNavigate={store.goToView}
        onOpenTask={store.openTask}
      />

      {store.activeView === 'home' && (
        <HomeView
          onBrowseTemplates={() => store.goToView('templates')}
          onPreview={store.openPreview}
          onStartCreating={() => store.goToView('workbench')}
          onUseTemplate={store.openStudio}
        />
      )}

      {store.activeView === 'workbench' && store.creationStage === 'choose' && (
        <TemplateDiscovery
          draftTemplate={store.selectedStudioTemplate}
          hasDraft={store.hasStudioDraft}
          templates={store.availableTemplates}
          onOpenAllTemplates={() => store.goToView('templates')}
          onResumeDraft={store.resumeStudioDraft}
          onSelectTemplate={store.openStudio}
        />
      )}

      {store.activeView === 'workbench' && store.creationStage === 'edit' && (
        <StudioPage
          assets={store.demoAssets}
          creditBalance={store.creditBalance}
          outputSettings={store.outputSettings}
          selectedAssetId={store.selectedStudioAssetId}
          tasks={store.demoTasks}
          template={store.selectedStudioTemplate}
          onAssetSelect={store.selectStudioAsset}
          onChangeTemplate={store.openTemplatePicker}
          onCredits={store.openCredits}
          onOpenAssetPicker={store.openAssetPicker}
          onOpenTask={store.openTask}
          onOutputSettingChange={store.updateOutputSetting}
          onPreview={store.openPreview}
          onSubmit={store.submitBatchGeneration}
        />
      )}

      {store.activeView === 'templates' && (
        <TemplatesView
          searchTerm={store.searchTerm}
          selectedFilters={store.selectedFilters}
          templates={store.filteredTemplates}
          totalTemplateCount={store.availableTemplates.length}
          onClearFilters={store.clearFilters}
          onFilter={store.openFilters}
          onOpenTemplate={store.openTemplate}
          onSearch={store.setSearchTerm}
          onToggleFilter={store.toggleFilter}
        />
      )}

      {store.activeView === 'works' && (
        <WorksView
          section={store.worksSection}
          tasks={store.demoTasks}
          assets={store.demoAssets}
          assetFilters={store.assetFilters}
          customAssetFilters={store.customAssetFilters}
          uploadReceipt={store.uploadReceipt}
          onSectionChange={store.setWorksSection}
          onOpenTask={store.openTask}
          onDownloadTask={store.downloadTaskResult}
          onReuseTask={store.reuseTask}
          onArchiveAsset={store.archiveAsset}
          onCancelUpload={store.cancelUpload}
          onCreateAssetCategory={store.createAssetCategory}
          onDeleteAssetCategory={store.deleteAssetCategory}
          onDownloadAsset={store.downloadAsset}
          onPreview={store.openPreview}
          onRenameAsset={store.renameAsset}
          onRestoreAsset={store.restoreAsset}
          onRetryUpload={store.retryUpload}
          onReuseAsset={store.reuseAsset}
          onUpdateAssetCategory={store.updateAssetCategory}
          onUploadAsset={store.uploadLibraryAsset}
        />
      )}

      <footer className="app-trust-footer">
        <span>请仅上传你拥有使用权或已获得授权的素材。</span>
      </footer>

      <AppOverlays
        accountSection={store.accountSection}
        assetFilters={store.assetFilters}
        assets={store.demoAssets}
        authMode={store.authMode}
        creditBalance={store.creditBalance}
        frozenCredits={store.frozenCredits}
        isPrototype={store.isPrototype}
        ledgerRows={store.demoLedgerRows}
        overlay={store.overlay}
        paymentOrder={store.paymentOrder}
        previewMedia={store.previewMedia}
        rechargePackages={store.rechargePackages}
        session={store.session}
        qrLoginSession={store.qrLoginSession}
        selectedAssetId={store.selectedStudioAssetId}
        selectedFilters={store.selectedFilters}
        selectedTask={store.selectedTask}
        selectedTemplate={store.selectedTemplate}
        studioTemplate={store.selectedStudioTemplate}
        templates={store.availableTemplates}
        signupRewardStatus={store.signupRewardStatus}
        toast={store.toast}
        uploadReceipt={store.uploadReceipt}
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
        onLogout={store.logout}
        onOpenAssetLibrary={store.openAssetLibrary}
        onPreview={store.openPreview}
        onQrRefresh={store.refreshQrLoginSession}
        onQrStatusChange={store.updateQrLoginStatus}
        onResolvePaymentOrder={store.resolvePaymentOrder}
        onRetryUpload={store.retryUpload}
        onSelectAsset={store.selectAssetFromPicker}
        onSelectTemplate={store.selectStudioTemplate}
        onToast={store.setToast}
        onToggleFilter={store.toggleFilter}
        onUploadAsset={store.uploadStudioAsset}
      />
    </main>
  )
}

export default App
