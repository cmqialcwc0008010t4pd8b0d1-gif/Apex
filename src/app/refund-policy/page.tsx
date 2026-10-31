import PublicNavbar from "@/components/public/Navbar";
import PublicFooter from "@/components/public/Footer";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function RefundPolicyPage() {
  let cms: any = null;
  try {
    cms = await prisma.cmsContent.findUnique({
      where: { key: "refund_policy" },
    });
  } catch (err) {
    console.error("Refund policy CMS fallback:", err);
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0B1120]">
      <PublicNavbar />

      <main className="flex-1 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div>
            <span className="text-teal-400 text-xs font-bold uppercase tracking-wider">Treasury Guidelines</span>
            <h1 className="text-3xl font-extrabold text-white mt-1">Refund Policy for Digital Educational Materials</h1>
            <p className="text-xs text-slate-400 mt-1">Standards governing manual payments and digital IP access.</p>
          </div>

          <div className="finance-card p-8 md:p-10 text-slate-300 leading-relaxed text-sm space-y-6">
            <div className="article-prose">
              {cms?.content ? (
                <div dangerouslySetInnerHTML={{ __html: cms.content.replace(/\n\n/g, "<br/><br/>").replace(/### (.*?)\n/g, "<h3 class='text-white font-bold text-lg mt-4 mb-2'>$1</h3>").replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }} />
              ) : (
                <p>Digital content refund policy.</p>
              )}
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
