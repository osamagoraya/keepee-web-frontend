
const items = [
  {
    label: "Invoices",
    isSubsectionList: true,
    remotePath: '/getImages',
    localBasePath: '/invoice',
    // move the following to requiredProps object
    isSelectedUserIdRequired: true
  },
  {
    label: "Batches",
    isSubsectionList: true,
    localBasePath: '/batch',
  },
  {
    label: "Account Inquiries",
    isSubsectionList: false,
    localBasePath: '/account-inquiry',
  },
  {
    label: "VAT Report",
    isSubsectionList: true,
    localBasePath: '/report/vat',
  },
  {
    label: "Income Tax Advances",
    isSubsectionList: true,
    localBasePath: "/report/income-tax-advances"
  },
  {
    label: "P & L",
    isSubsectionList: true,
    localBasePath: "/report/profilt-and-loss"
  },
  {
    label: "Trial Balance",
    isSubsectionList: true,
    localBasePath: "/report/trial-balance"
  },
];

export default items;