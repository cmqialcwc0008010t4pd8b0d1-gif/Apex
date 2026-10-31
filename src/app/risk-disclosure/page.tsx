import PublicNavbar from "@/components/public/Navbar";
import PublicFooter from "@/components/public/Footer";
import { AlertTriangle } from "lucide-react";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function RiskDisclosurePage() {
  let cms: any = null;
  try {
    cms = await prisma.cmsContent.findUnique({
      where: { key: "risk_disclosure" },
    });
  } catch (err) {
    console.error("Risk disclosure CMS fallback:", err);
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0B1120]">
      <PublicNavbar />

      <main className="flex-1 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950 text-amber-400 border border-amber-800 text-xs font-semibold uppercase">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Mandatory Regulatory Warning</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white">Financial Trading Risk Disclosure Notice</h1>
            <p className="text-xs text-slate-400">Essential disclosures concerning speculative financial market activities.</p>
          </div>

          <div className="finance-card p-8 md:p-10 text-slate-300 leading-relaxed text-sm space-y-6 border-amber-900/50">
            <div className="article-prose">
              {cms?.content ? (
                <div dangerouslySetInnerHTML={{ __html: cms.content.replace(/\n\n/g, "<br/><br/>").replace(/### (.*?)\n/g, "<h3 class='text-white font-bold text-lg mt-4 mb-2'>$1</h3>").replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }} />
              ) : (
                <p>Trading financial assets involves high risk of loss.</p>
              )}
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
