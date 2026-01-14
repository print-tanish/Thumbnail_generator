import type { IPricing } from "../types";

export const pricingData: IPricing[] = [
    {
        name: "Basic",
        price: 29,
        period: "month",
        features: [
            "50 thumbnail generations per month",
            "Basic community support",
            "Standard templates",
            "No watermark",
            "Email support"
        ],
        mostPopular: false
    },
    {
        name: "Pro",
        price: 79,
        period: "month",
        features: [
            "Unlimited thumbnail generations",
            "Premium templates",
            "4K resolution downloads",
            "Priority support",
            "Custom thumbnail requests"
        ],
        mostPopular: true
    },
    {
        name: "Enterprise",
        price: 199,
        period: "month",
        features: [
            "Everything in Pro",
            "API access",
            "Unlimited projects",
            "Custom Branding",
            "Account manager"
        ],
        mostPopular: false
    }
];