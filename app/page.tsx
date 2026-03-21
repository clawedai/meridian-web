import Link from "next/link";
import { ArrowRight, Brain, TrendingUp, Zap, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent-primary">
              <span className="text-lg font-bold text-white">D</span>
            </div>
            <span className="text-lg font-semibold text-foreground">Drishti</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Sign in</Button>
            </Link>
            <Link href="/register">
              <Button>Get started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent-primary/30 bg-accent-primary/10 px-4 py-1.5 text-sm text-accent-primary mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-primary"></span>
            </span>
            Now in private beta
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 tracking-tight">
            Intelligence that<br />
            <span className="text-accent-primary">drives decisions</span>
          </h1>
          <p className="text-xl text-foreground-secondary max-w-2xl mx-auto mb-10">
            Stop drowning in data. Drishti monitors your competitors, analyzes market trends,
            and delivers actionable insights — so you can focus on building.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="gap-2">
                Start free trial <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline">
                View demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center text-foreground mb-16">
            Everything you need to stay ahead
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: "AI-Powered Analysis",
                description: "Claude-powered insights that synthesize data from multiple sources into actionable intelligence.",
              },
              {
                icon: TrendingUp,
                title: "Competitor Monitoring",
                description: "Track pricing changes, product launches, funding rounds, and market movements automatically.",
              },
              {
                icon: Zap,
                title: "Instant Alerts",
                description: "Get notified the moment something important happens — via email, webhook, or in-app.",
              },
              {
                icon: Shield,
                title: "Beautiful Reports",
                description: "Generate professional reports for investors, clients, or your team with one click.",
              },
              {
                icon: TrendingUp,
                title: "Trend Detection",
                description: "AI identifies patterns and anomalies in your market before your competitors do.",
              },
              {
                icon: Brain,
                title: "Deep Context",
                description: "Not just what changed — but why it matters and what you should do about it.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="p-6 rounded-lg border border-white/5 bg-background-secondary hover:border-accent-primary/30 transition-colors"
              >
                <feature.icon className="h-10 w-10 text-accent-primary mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-foreground-secondary">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center text-foreground mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-center text-foreground-secondary mb-12">
            Start free, scale as you grow. No hidden fees.
          </p>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Starter",
                price: "$250",
                description: "Perfect for founders getting started",
                features: ["5 entities", "10 data sources", "Weekly digest", "Email support"],
              },
              {
                name: "Growth",
                price: "$500",
                description: "For growing startups and agencies",
                features: ["20 entities", "40 data sources", "Real-time alerts", "API access", "Custom scrapers"],
                popular: true,
              },
              {
                name: "Scale",
                price: "$750",
                description: "Enterprise-grade intelligence",
                features: ["Unlimited entities", "Unlimited sources", "White-label reports", "Team seats", "Priority support"],
              },
            ].map((plan, i) => (
              <div
                key={i}
                className={`relative p-6 rounded-lg border ${
                  plan.popular
                    ? "border-accent-primary bg-accent-primary/5"
                    : "border-white/5 bg-background-secondary"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-accent-primary text-xs font-medium text-white">
                    Most popular
                  </div>
                )}
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-3xl font-bold text-foreground">
                    {plan.price}
                  </span>
                  <span className="text-foreground-secondary">/month</span>
                </div>
                <p className="text-sm text-foreground-secondary mb-6">
                  {plan.description}
                </p>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-foreground-secondary">
                      <svg className="h-4 w-4 text-success flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href="/register" className="block">
                  <Button
                    variant={plan.popular ? "default" : "outline"}
                    className="w-full"
                  >
                    Get started
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to get intelligent?
          </h2>
          <p className="text-foreground-secondary mb-8">
            Join the beta and start tracking your competition today.
          </p>
          <Link href="/register">
            <Button size="lg" className="gap-2">
              Start your free trial <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/5">
        <div className="mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-accent-primary">
              <span className="text-sm font-bold text-white">D</span>
            </div>
            <span className="text-sm text-foreground-secondary">Drishti</span>
          </div>
          <p className="text-sm text-foreground-muted">
            © 2024 Drishti. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
