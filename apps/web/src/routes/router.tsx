import { PermissionGate } from "@/components/auth/PermissionGate";
import { AppLayout } from "@/components/layout/AppLayout";
import { AuthCardLayout } from "@/pages/auth/AuthCardLayout";
import { ForgotPasswordPage } from "@/pages/auth/ForgotPasswordPage";
import { LoginPage } from "@/pages/auth/LoginPage";
import { PublicGuard } from "@/pages/auth/PublicGuard";
import { RegisterPage } from "@/pages/auth/RegisterPage";
import { VerifyEmailPage } from "@/pages/auth/VerifyEmailPage";
import { CommercialCalendarPage } from "@/pages/commercial/CommercialCalendarPage";
import { RentalsPipelinePage } from "@/pages/commercial/RentalsPipelinePage";
import { SalesPipelinePage } from "@/pages/commercial/SalesPipelinePage";
import { ContactDetailPage } from "@/pages/crm/ContactDetailPage";
import { ContactNewPage } from "@/pages/crm/ContactNewPage";
import { ContactsPage } from "@/pages/crm/ContactsPage";
import { CrmReportsPage } from "@/pages/crm/CrmReportsPage";
import { DealsPage } from "@/pages/crm/DealsPage";
import { LeadDetailPage } from "@/pages/crm/LeadDetailPage";
import { LeadNewPage } from "@/pages/crm/LeadNewPage";
import { LeadsPage } from "@/pages/crm/LeadsPage";
import { PipelinePage } from "@/pages/crm/PipelinePage";
import { DashboardPage } from "@/pages/dashboard/DashboardPage";
import { AccountsPage } from "@/pages/finance/AccountsPage";
import { CashflowPage } from "@/pages/finance/CashflowPage";
import { FinanceReportsPage } from "@/pages/finance/FinanceReportsPage";
import { ReconciliationPage } from "@/pages/finance/ReconciliationPage";
import { TransactionNewPage } from "@/pages/finance/TransactionNewPage";
import { TransactionsPage } from "@/pages/finance/TransactionsPage";
import { IntegrationsHomePage } from "@/pages/integrations/IntegrationsHomePage";
import { MappingPage } from "@/pages/integrations/MappingPage";
import { QueuePage } from "@/pages/integrations/QueuePage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { PropertiesPage } from "@/pages/properties/PropertiesPage";
import { PropertyDetailPage } from "@/pages/properties/PropertyDetailPage";
import { PropertyFormPage } from "@/pages/properties/PropertyFormPage";
import { RootRedirect } from "@/pages/RootRedirect";
import { AuditPage } from "@/pages/settings/AuditPage";
import { CustomFieldsPage } from "@/pages/settings/CustomFieldsPage";
import { OrgPage } from "@/pages/settings/OrgPage";
import { SettingsHomePage } from "@/pages/settings/SettingsHomePage";
import { WebhooksPage } from "@/pages/settings/WebhooksPage";
import { WhatsAppPage } from "@/pages/whatsapp/WhatsAppPage";
import { RequireAuth } from "@/routes/RequireAuth";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  { path: "/", element: <RootRedirect /> },
  {
    element: <PublicGuard />,
    children: [
      {
        element: <AuthCardLayout />,
        children: [
          { path: "/login", element: <LoginPage /> },
          { path: "/register", element: <RegisterPage /> },
          { path: "/forgot-password", element: <ForgotPasswordPage /> },
          { path: "/verify-email", element: <VerifyEmailPage /> },
        ],
      },
    ],
  },
  {
    element: <RequireAuth />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: "/dashboard", element: <DashboardPage /> },

          { path: "/crm/leads", element: <LeadsPage /> },
          { path: "/crm/leads/:id", element: <LeadDetailPage /> },
          {
            path: "/crm/leads/new",
            element: (
              <PermissionGate permission="crm.write">
                <LeadNewPage />
              </PermissionGate>
            ),
          },
          { path: "/crm/contacts", element: <ContactsPage /> },
          {
            path: "/crm/contacts/new",
            element: (
              <PermissionGate permission="crm.write">
                <ContactNewPage />
              </PermissionGate>
            ),
          },
          { path: "/crm/contacts/:id", element: <ContactDetailPage /> },
          { path: "/crm/pipeline", element: <PipelinePage /> },
          { path: "/crm/deals", element: <DealsPage /> },
          { path: "/crm/reports", element: <CrmReportsPage /> },

          { path: "/properties", element: <PropertiesPage /> },
          {
            path: "/properties/new",
            element: (
              <PermissionGate permission="properties.write">
                <PropertyFormPage />
              </PermissionGate>
            ),
          },
          {
            path: "/properties/:id/edit",
            element: (
              <PermissionGate permission="properties.write">
                <PropertyFormPage />
              </PermissionGate>
            ),
          },
          { path: "/properties/:id", element: <PropertyDetailPage /> },

          { path: "/commercial/sales", element: <SalesPipelinePage /> },
          { path: "/commercial/rentals", element: <RentalsPipelinePage /> },
          { path: "/commercial/calendar", element: <CommercialCalendarPage /> },

          { path: "/finance/accounts", element: <AccountsPage /> },
          { path: "/finance/transactions", element: <TransactionsPage /> },
          {
            path: "/finance/transactions/new",
            element: (
              <PermissionGate permission="finance.write">
                <TransactionNewPage />
              </PermissionGate>
            ),
          },
          { path: "/finance/cashflow", element: <CashflowPage /> },
          { path: "/finance/reports", element: <FinanceReportsPage /> },
          { path: "/finance/reconciliation", element: <ReconciliationPage /> },

          { path: "/integrations", element: <IntegrationsHomePage /> },
          { path: "/integrations/mapping", element: <MappingPage /> },
          { path: "/integrations/queue", element: <QueuePage /> },

          { path: "/whatsapp", element: <WhatsAppPage /> },

          { path: "/settings", element: <SettingsHomePage /> },
          { path: "/settings/org", element: <OrgPage /> },
          { path: "/settings/audit", element: <AuditPage /> },
          { path: "/settings/webhooks", element: <WebhooksPage /> },
          { path: "/settings/custom-fields", element: <CustomFieldsPage /> },
        ],
      },
    ],
  },
  { path: "*", element: <NotFoundPage /> },
]);
