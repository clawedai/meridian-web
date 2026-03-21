"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const plans = [
  {
    id: "starter",
    name: "Starter",
    price: 250,
    description: "Perfect for founders getting started",
    features: [
      "5 entities",
      "10 data sources",
      "Weekly digest",
      "Email support",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    price: 500,
    description: "For growing startups and agencies",
    features: [
      "20 entities",
      "40 data sources",
      "Real-time alerts",
      "API access",
      "Custom scrapers",
    ],
    popular: true,
  },
  {
    id: "scale",
    name: "Scale",
    price: 750,
    description: "Enterprise-grade intelligence",
    features: [
      "Unlimited entities",
      "Unlimited sources",
      "White-label reports",
      "5 team seats",
      "Priority support",
    ],
  },
];

export default function BillingPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [currentPlan] = useState("growth"); // Mock current plan

  const handleSubscribe = async (planId: string) => {
    setLoading(planId);

    try {
      // In production, this would call your backend to create a Stripe checkout session
      // For now, show a demo message
      alert(`Demo: Would create Stripe checkout for ${planId} plan\n\nTo enable payments:\n1. Add STRIPE_SECRET_KEY to backend .env\n2. Set up Stripe products in Stripe Dashboard\n3. Connect your account`);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (err) {
      console.error("Failed to start checkout:", err);
    } finally {
      setLoading(null);
    }
  };

  return (
    <>
      <Header
        title="Billing"
        subtitle="Manage your subscription and payments"
      />

      <div className="flex-1 overflow-auto p-6">
        {/* Current Plan */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground">
                  Current Plan
                </h3>
                <p className="text-sm text-foreground-secondary">
                  You're on the{" "}
                  <span className="text-accent-primary font-medium">
                    {plans.find((p) => p.id === currentPlan)?.name}
                  </span>{" "}
                  plan
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-foreground">
                  ${plans.find((p) => p.id === currentPlan)?.price}
                  <span className="text-sm font-normal text-foreground-muted">
                    /mo
                  </span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Available Plans */}
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Available Plans
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative ${
                plan.popular
                  ? "border-accent-primary bg-accent-primary/5"
                  : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-accent-primary text-white">Most Popular</Badge>
                </div>
              )}

              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  {plan.name}
                </h3>
                <p className="text-sm text-foreground-secondary mb-4">
                  {plan.description}
                </p>

                <div className="mb-6">
                  <span className="text-3xl font-bold text-foreground">
                    ${plan.price}
                  </span>
                  <span className="text-foreground-muted">/month</span>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-foreground-secondary">
                      <Check className="h-4 w-4 text-success flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {plan.id === currentPlan ? (
                  <Button variant="secondary" className="w-full" disabled>
                    Current Plan
                  </Button>
                ) : (
                  <Button
                    variant={plan.popular ? "default" : "outline"}
                    className="w-full"
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={loading !== null}
                  >
                    {loading === plan.id ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Processing...
                      </>
                    ) : plan.price > plans.find((p) => p.id === currentPlan)!.price ? (
                      "Upgrade"
                    ) : (
                      "Downgrade"
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Billing History */}
        <div className="mt-12">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Billing History
          </h2>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-white/5">
                  <div>
                    <p className="font-medium text-foreground">Growth Plan</p>
                    <p className="text-sm text-foreground-muted">Mar 1, 2024</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="success">Paid</Badge>
                    <p className="font-medium text-foreground">$500.00</p>
                    <Button variant="ghost" size="sm">
                      Download
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-white/5">
                  <div>
                    <p className="font-medium text-foreground">Growth Plan</p>
                    <p className="text-sm text-foreground-muted">Feb 1, 2024</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="success">Paid</Badge>
                    <p className="font-medium text-foreground">$500.00</p>
                    <Button variant="ghost" size="sm">
                      Download
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-foreground">Growth Plan</p>
                    <p className="text-sm text-foreground-muted">Jan 1, 2024</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="success">Paid</Badge>
                    <p className="font-medium text-foreground">$500.00</p>
                    <Button variant="ghost" size="sm">
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cancel */}
        <div className="mt-8 text-center">
          <Button variant="ghost" className="text-error hover:text-error">
            Cancel Subscription
          </Button>
        </div>
      </div>
    </>
  );
}
