import { useParams } from "react-router-dom";
import { useData } from "@/contexts/data";
import { useI18n } from "@/contexts/i18n";
import Breadcrumbs from "@/components/Breadcrumbs";
import { cn } from "@/lib/utils";
import { useSettings } from "@/contexts/settings";

export default function ArticlePage() {
  const { id, articleId } = useParams<{ id: string; articleId: string }>();
  const { lang } = useI18n();
  const { menu } = useData();
  const settings = useSettings();
  const section = menu.find((s: any) => String(s.id) === String(id));
  const article = section?.articles.find(
    (a) => String(a.id) === String(articleId),
  );

  if (!section || !article) {
    return (
      <main className="mx-auto max-w-7xl w-full px-4 md:px-6 py-10 min-h-screen">
        <Breadcrumbs />
        <div className="text-muted-foreground">
          {lang === "az" ? "Məqalə tapılmadı" : "Article not found"}
        </div>
      </main>
    );
  }

  const idx = section.articles.findIndex(
    (a) => String(a.id) === String(articleId),
  );
  const alignRight = idx % 2 === 0;

  return (
    <main className="mx-auto max-w-7xl w-full px-4 md:px-6 pb-16 pt-6 md:pt-8 min-h-screen">
      <Breadcrumbs />
      <div className="mt-1 flex items-start justify-between gap-4">
        <h1 className="text-2xl md:text-4xl font-bold tracking-tight">
          {lang === "az" ? article.title.az : article.title.en}
        </h1>
        <div className="text-base md:text-lg font-semibold whitespace-nowrap md:mt-1 px-4 py-1.5 rounded-full bg-accent text-foreground border shadow-sm">
          {article.date}
        </div>
      </div>
      <img
        src={article.image || settings.placeholder || "/placeholder.svg"}
        alt=""
        className={cn(
          "mt-5 rounded-2xl border w-full md:w-96 object-cover",
          alignRight ? "md:float-right md:ml-8" : "md:float-left md:mr-8",
        )}
      />
      <div className="prose prose-slate max-w-none mt-6">
        {(() => {
          const html = lang === "az" ? article.body.az : article.body.en;
          const isHtml = /<\w+/.test(html);
          return isHtml ? (
            <div dangerouslySetInnerHTML={{ __html: html }} />
          ) : (
            <p>{html}</p>
          );
        })()}
        <p>
          {lang === "az"
            ? "Enerji siyasətinin əsas məqsədi dayanıqlı inkişafı təmin etmək, resurslardan səmərəli istifadəni artırmaq və ətraf mühitin mühafizəsini gücləndirməkdir. Bu istiqamətdə qanunvericilik islahatları aparılır, beynəlxalq tərəfdaşlarla əməkdaşlıq genişləndirilir və yeni texnologiyaların tətbiqi sürətləndirilir."
            : "The main goal of energy policy is to ensure sustainable development, increase efficient use of resources, and strengthen environmental protection. Legislative reforms are underway, cooperation with international partners is expanding, and the adoption of new technologies is accelerating."}
        </p>
        <p>
          {lang === "az"
            ? "Bərpa olunan enerji mənbələrinin payının artırılması, enerji səmərəliliyi layihələrinin dəstəklənməsi və innovativ həllərin tətbiqi ölkənin enerji təhlükəsizliyinə mühüm töhfə verir. Aşağıda məqalənin davamını oxuya bilərsiniz."
            : "Increasing the share of renewables, supporting energy efficiency projects, and deploying innovative solutions significantly contribute to the country's energy security. Continue reading below for the rest of the article."}
        </p>
        <p>
          {lang === "az"
            ? "Bu çərçivədə iri həcmli investisiya proqramları reallaşdırılır, regional şəbəkələrin modernləşdirilməsi və rəqəmsal həllərin tətbiqi sürətləndirilib. Sənaye müəssisələrində enerji auditi aparılır, israfçılığın qarşısını alan texnologiyalar tətbiq olunur və istehlakçıların məlumatlandırılması üçün təlimlər keçirilir."
            : "Within this framework, large-scale investment programs are being implemented, modernization of regional grids and deployment of digital solutions are accelerating. Energy audits are carried out in industrial enterprises, waste-preventing technologies are implemented, and trainings are held to inform consumers."}
        </p>
        <p>
          {lang === "az"
            ? "Elektrik enerjisinin istehsalı, ötürülməsi və paylanmasında səmərəlilik göstəricilərinin yüksəldilməsi məqsədilə yeni nəsil idarəetmə sistemləri qurulur. Şəbəkədə itkilərin azaldılması, ötürücü xətlərin gücləndirilməsi və ehtiyat güclərin yaradılması kimi tədbirlər davam etdirilir."
            : "New-generation management systems are being established to improve efficiency indicators in the production, transmission and distribution of electricity. Measures such as reducing network losses, strengthening transmission lines and creating reserve capacities continue."}
        </p>
        <p>
          {lang === "az"
            ? "Bundan əlavə, günəş və külək kimi bərpa olunan mənbələrdən enerji istehsalının artırılması üçün dövlət-özəl tərəfdaşlığı mexanizmləri tətbiq edilir. Layihələrin icrası üçün xüsusi iqtisadi zonalar yaradılır, investorlar üçün vergi və gömrük güzəştləri nəzərdə tutulur."
            : "In addition, public-private partnership mechanisms are being applied to increase energy production from renewable sources such as solar and wind. Special economic zones are created for the implementation of projects, and tax and customs incentives are provided for investors."}
        </p>
        <p>
          {lang === "az"
            ? "Enerji səmərəliliyinin artırılması nəqliyyat, sənaye və yaşayış sektorlarında paralel şəkildə həyata keçirilir. Ağıllı sayğacların quraşdırılması, istilik izolyasiyasının təkmilləşdirilməsi və enerjiyə qənaət edən məişət avadanlıqlarının təşviqi əhali və müəssisələr üçün real qənaət yaradır."
            : "Improving energy efficiency is carried out in parallel in the transport, industrial and residential sectors. The installation of smart meters, improvement of thermal insulation, and promotion of energy-saving household appliances create real savings for the population and enterprises."}
        </p>
        <p>
          {lang === "az"
            ? "Nəticə etibarilə, inteqrasiya olunmuş yanaşma sayəsində enerji infrastrukturunun dayanıqlığı artır, çevik idarəetmə mexanizmləri formalaşır və istehlakçı mərkəzli xidmətlər genişlənir. Bu istiqamətdə beynəlxalq təcrübə öyrənilir və qabaqcıl standartlar tətbiq olunur."
            : "As a result, thanks to an integrated approach, the resilience of the energy infrastructure increases, flexible management mechanisms are formed, and consumer-centered services expand. International experience is studied and advanced standards are applied in this direction."}
        </p>
        <p>
          {lang === "az"
            ? "Enerji keçidinin sosial-iqtisadi təsirləri də diqqət mərkəzindədir. Yeni iş yerləri yaradılır, yerli istehsal gücləndirilir və regionların balanslı inkişafı dəstəklənir. Təhsil və tədqiqat proqramları vasitəsilə ixtisaslı kadrların hazırlanması sürətləndirilib."
            : "The socio-economic impacts of the energy transition are also in focus. New jobs are being created, local production is strengthened, and balanced regional development is supported. The training of skilled personnel is accelerated through education and research programs."}
        </p>
        <p>
          {lang === "az"
            ? "İqlim dəyişmələri ilə mübarizədə beynəlxalq öhdəliklərə uyğun olaraq, emissiyaların azaldılması və karbon neytrallığı hədəfləri reallaşdırılır. Bu məqsədlə sektorlar üzrə yol xəritələri tərtib edilib və vaxt cədvəlləri müəyyənləşdirilib."
            : "In line with international commitments to combat climate change, emission reductions and carbon neutrality targets are being realized. For this purpose, roadmaps for sectors have been drawn up and timelines set."}
        </p>
        <p>
          {lang === "az"
            ? "Elektrikli nəqliyyat vasitələrinin şəbəkəsi genişlənir, şarj infrastrukturunun əlçatanlığı artır və yaşıl logistika həlləri tətbiq olunur. Bu, həm ekoloji, həm də iqtisadi faydalar yaradır."
            : "The network of electric vehicles is expanding, the availability of charging infrastructure is increasing, and green logistics solutions are being implemented. This creates both environmental and economic benefits."}
        </p>
        <p>
          {lang === "az"
            ? "Enerji bazarlarının liberallaşdırılması ilə rəqabət artır, istehlakçıların seçim imkanları genişlənir və xidmət keyfiyyəti yüksəlir. Rəqəmsal platformalar vasitəsilə şəffaflıq təmin olunur."
            : "With the liberalization of energy markets, competition increases, consumers' choices expand, and service quality improves. Transparency is ensured through digital platforms."}
        </p>
        <p>
          {lang === "az"
            ? "Nəticədə, yeni mərhələyə qədəm qoyan enerji sektoru uzunmüddətli dayanıqlığa, resursların səmərəli istifadəsinə və innovasiyalara əsaslanan ekosistem yaradır. Bu prosesdə bütün tərəfdaşların fəal iştirakı əsas şərtdir."
            : "As a result, the energy sector entering a new phase creates an ecosystem based on long-term resilience, efficient use of resources, and innovation. The active participation of all stakeholders is a key requirement in this process."}
        </p>
      </div>
      <div className="clear-both" />
    </main>
  );
}
