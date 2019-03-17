import logoReport from '../Assets/Images/Path_900.svg';
import logoCalender from '../Assets/Images/Path_899.svg';
import logoDocument from '../Assets/Images/Path_901.svg';
import logoUser from '../Assets/Images/Path_902.svg';
import logoSettings from '../Assets/Images/Path_1054.svg'

import InvoiceMenubarItems from '../Components/Dashboard/MenubarItems/InvoiceMenubarItems';
import BatchMenubarItems from '../Components/Dashboard/MenubarItems/BatchMenubarItems';
import AccountInquiryFilters from '../Components/Dashboard/MenubarItems/AccountInquiryFilters';
import VatMenubarItems from '../Components/Dashboard/MenubarItems/VatMenubarItems';
import Dummy from '../Components/Dummy';


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
        component: Dummy
      },
      {
        label: "P & L",
        path: "/workspace/report/profilt-and-loss",
        component: Dummy
      },
      {
        label: "Trial Balance",
        path: "/workspace/report/trial-balance",
        component: Dummy
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
    to: "/projections",
    menubarComponent: undefined,
    icon: logoDocument,
    menubarItems: []
  },
  {
    to: "/profile",
    menubarComponent: undefined,
    icon: logoUser,
    menubarItems: []
  },
  {
    to: "/settings",
    menubarComponent: undefined,
    icon: logoSettings,
    menubarItems: []
  },
]

export default appRoutes;