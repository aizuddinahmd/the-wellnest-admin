import React from "react";

const pricingTiers = [
  {
    name: "SELF PAY",
    panel: "2 included",
    selfPay: "4 included",
    price: "",
  },
  {
    name: "PANEL",
    panel: "18 included",
    selfPay: "None included",
    price: "",
  },
  {
    name: "PANEL - MADANI",
    panel: "5 included",
    selfPay: "None included",
    price: "",
  },
];

function InfoIcon() {
  return (
    <svg
      width="20"
      height="20"
      fill="none"
      viewBox="0 0 20 20"
      className="ml-1 inline-block align-middle text-gray-400"
    >
      <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
      <rect
        x="9.25"
        y="8"
        width="1.5"
        height="5"
        rx="0.75"
        fill="currentColor"
      />
      <rect
        x="9.25"
        y="5.5"
        width="1.5"
        height="1.5"
        rx="0.75"
        fill="currentColor"
      />
    </svg>
  );
}

export function PricingSection() {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-xl font-bold">Pricing</h3>
        <a
          href="/settings/pricing-tiers"
          className="flex items-center gap-1 text-sm font-medium underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Go to pricing tier setting
          <svg
            width="16"
            height="16"
            fill="none"
            viewBox="0 0 16 16"
            className="ml-1 inline-block"
          >
            <path
              d="M8 3h5v5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8 8l5-5M13 13H3V3"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </div>
      <p className="mb-4 text-sm text-gray-600">
        Set default pricing tier for this item. You can manage your pricing tier
        in settings.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b">
              <th className="py-2 text-left text-xs font-semibold text-gray-500">
                NAME
              </th>
              <th className="py-2 text-left text-xs font-semibold text-gray-500">
                PAYMENT METHODS
              </th>
              <th className="py-2 text-left text-xs font-semibold text-gray-500">
                PRICE
              </th>
            </tr>
          </thead>
          <tbody>
            {pricingTiers.map((tier, idx) => (
              <tr key={tier.name} className="border-b last:border-b-0">
                <td className="py-4 font-semibold whitespace-nowrap text-gray-800">
                  {tier.name}
                </td>
                <td className="py-4 whitespace-nowrap text-gray-700">
                  <div>Panel: {tier.panel}</div>
                  <div>Self-Pay: {tier.selfPay}</div>
                  <InfoIcon />
                </td>
                <td className="py-4">
                  <div className="flex items-center">
                    <span className="mr-2 text-gray-500">RM</span>
                    <input
                      type="number"
                      placeholder="0.00"
                      className="w-32 rounded-xl border border-gray-300 bg-gray-50 px-4 py-2 text-right text-base text-gray-800 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
