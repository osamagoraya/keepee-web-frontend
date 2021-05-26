import logoReport from '../Assets/Images/Path_900.svg';
import logoCalender from '../Assets/Images/Path_899.svg';
import logoDocument from '../Assets/Images/Path_901.svg';
import logoUser from '../Assets/Images/Path_902.svg';
import logoSettings from '../Assets/Images/Path_1054.svg'

import InvoiceMenubarItems from '../Components/Dashboard/MenubarItems/InvoiceMenubarItems';
import BatchMenubarItems from '../Components/Dashboard/MenubarItems/BatchMenubarItems';
import AccountInquiryFilters from '../Components/Dashboard/MenubarItems/AccountInquiryFilters';
import VatMenubarItems from '../Components/Dashboard/MenubarItems/VatMenubarItems';
import IncomeTaxAdvancesItems from '../Components/Dashboard/MenubarItems/IncomeTaxAdvancesItems';
// import ProfitAndLossItems from '../Components/Dashboard/MenubarItems/ProfitAndLossItems';
import TrialBalanceItems from '../Components/Dashboard/MenubarItems/TrialBalanceItems';
import BusinessProfileItems from '../Components/Dashboard/MenubarItems/BusinessProfileItems';
import UnifiedFormItems from '../Components/Dashboard/MenubarItems/UnifiedFormItems';
import EmailSettingItems from '../Components/Dashboard/MenubarItems/EmailSettingsItems';
import TaxAttributesYears from '../Components/Dashboard/MenubarItems/TaxAttributesYears';

const appRoutes = [
  {
    to: "/workspace",
    menubarComponent: undefined,
    icon: logoReport,
    menubarItems: [
      {
        label: "Invoices",
        path: "/workspace/invoice",
        component: InvoiceMenubarItems
      },
      {
        label: "Batches",
        path: "/workspace/batch",
        component: BatchMenubarItems
      },
      {
        label: "Account Inquiries",
        path: "/workspace/account-inquiry",
        component: AccountInquiryFilters
      },
      {
        label: "VAT Report",
        path: "/workspace/report/vat",
        component: VatMenubarItems
        
      },
      {
        label: "Income Tax Advances",
        path: "/workspace/report/income-tax-advances",
        component: IncomeTaxAdvancesItems
      },
      {
        label: "P & L",
        path: "/workspace/report/profilt-and-loss",
        component: null
      },
      {
        label: "Trial Balance",
        path: "/workspace/report/trial-balance",
        component: TrialBalanceItems
      }
    ]
  },
  {
    to: "/calendar",
    menubarComponent: undefined,
    icon: logoCalender,
    menubarItems: []
  },
  {
    to: "/invoices",
    menubarComponent: undefined,
    icon: logoDocument,
    menubarItems: [
      {
        label: "Invoices",
        path: "/invoices/invoice"
      },
      {
        label: "Invoice-items",
        path: "/invoices/item"
      }
    ]
  },
  {
    to: "/profile",
    menubarComponent: undefined,
    icon: logoUser,
    menubarItems: [
      {
        label: "Personal Details",
        path: "/profile/business",
        component: BusinessProfileItems
      },
      {
        label: "Email Settings",
        path: "/profile/email-settings",
        component: EmailSettingItems
      }
    ]
  },
  {
    to: "/settings",
    menubarComponent: undefined,
    icon: logoSettings,
    menubarItems: [
      {
        label: "Category Settings",
        path: "/settings/categories"
      },
      {
        label: "Accountants Assignment",
        path: "/settings/accountant-assigment"
      },
      {
        label: "Unified Form",
        path: "/settings/unified-form",
      },
      {
        label: "Tax Attributes",
        path: "/settings/tax-attributes",
        component : TaxAttributesYears
      },
      {
        label: "Vendors",
        path: "/settings/ocr-vendors"
      },
      {
        label: "User Management",
        path: "/settings/user-management"
      }
    ]
  },
  {
    to: "/logout",
    menubarComponent: false,
    icon: "logout",
    menubarItems: []
  }
]

export default appRoutes;