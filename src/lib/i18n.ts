/**
 * i18n infrastructure: locale helpers + the UI-string dictionary.
 * EN is the default locale (unprefixed URLs); VI pages live under /vi/…
 * and fall back to EN content field-by-field when a VI field is empty.
 */
import { SITE, withBase, type Locale } from './site';
export type { Locale };

/** BCP-47 tags for <html lang> / hreflang — short form per W3C guidance. */
export const HTML_LANG: Record<Locale, string> = { en: 'en', vi: 'vi' };

/** OpenGraph locale tags. */
export const OG_LOCALE: Record<Locale, string> = { en: 'en_US', vi: 'vi_VN' };

/**
 * The current page's path in the target locale: strips the deploy base and
 * any existing /vi prefix, then applies the target prefix. Query strings are
 * preserved so the projects filter state survives a language switch.
 */
export function switchLocalePath(url: URL, target: Locale): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  let p = url.pathname.startsWith(base) ? url.pathname.slice(base.length) : url.pathname;
  p = '/' + p.replace(/^\/+|\/+$/g, '');
  p = p.replace(/^\/vi(?=\/|$)/, '');
  const out = (target === 'vi' ? '/vi' : '') + (p === '/' ? '/' : p);
  return withBase(out.endsWith('/') ? out : out + '/') + (url.search || '');
}

/** EN value with a VI override when one is provided (empty VI falls back). */
export function pick<T>(locale: Locale, en: T, vi: T | undefined | null): T {
  return locale === 'vi' && vi ? vi : en;
}

const en = {
  nav: {
    projects: 'Projects',
    studio: 'Studio',
    journal: 'Journal',
    contact: 'Contact',
    startProject: 'Start a project',
    toggleMenu: 'Toggle menu',
    language: 'Language',
  },
  footer: {
    explore: 'Explore',
    allProjects: 'All projects',
    practice: 'Practice',
    contact: 'Contact',
    hours: 'Mon – Sat, 8:30 – 18:00',
    rights: 'All rights reserved.',
    byline: 'Interior · Furniture · Design–Build',
  },
  meta: {
    home: { title: `${SITE.name} — ${SITE.tagline}`, description: SITE.description },
    about: {
      title: 'Studio',
      description:
        'FORMA Studio is an interior and furniture design practice in Vietnam — designers, joiners and site supervisors working as one team.',
    },
    contact: {
      title: 'Contact',
      description:
        "Start a project with FORMA Studio — tell us about your site, budget and timeline, and we'll respond within two working days.",
    },
    projects: {
      title: 'Projects',
      description:
        'Browse our portfolio of residential, hospitality, workplace and retail projects. Filter by category, design style or floor area.',
    },
    journal: {
      title: 'Journal',
      description:
        'Notes from the FORMA Studio practice — materials, process and lessons from delivered projects.',
    },
    notFound: { title: 'Page not found' },
  },
  home: {
    srTitle: `${SITE.name} — ${SITE.tagline.toLowerCase()} portfolio`,
    featuredLabel: 'Featured projects',
    pause: 'Pause slideshow',
    play: 'Play slideshow',
    heroAltSuffix: 'hero image',
    statsLabels: ['Projects delivered', 'Years of practice', 'Designers & makers', 'm² fitted out'],
    selectedWork: 'Selected work',
    viewProject: 'View project',
    proudHeading: "Projects we're proud to sign",
    allProjects: 'All projects →',
    filterGroup: 'Filter by category',
    all: 'All',
    servicesEyebrow: 'What we do',
    servicesHeading: 'From first sketch to final styling',
    services: [
      {
        title: 'Interior architecture',
        text: 'Concept to construction drawings — plans, lighting, materials and joinery detail resolved before anything is built.',
      },
      {
        title: 'Furniture & joinery',
        text: 'Bespoke pieces designed, prototyped and produced in our partner workshop, from a single table to full casegoods.',
      },
      {
        title: 'Design–build fit-out',
        text: 'Turnkey delivery with one team responsible for design intent, cost and schedule through to handover.',
      },
      {
        title: 'Feasibility & consulting',
        text: 'Layout, budget and concept testing for investors before a lease is signed — so decisions are made on numbers.',
      },
    ],
    processEyebrow: 'How we work',
    processHeading: 'A process built for trust',
    processIntro:
      'Most of our clients are investing in a space for the first time. The process is transparent on purpose — you always know what happens next, what it costs, and who is accountable.',
    process: [
      {
        step: '01',
        title: 'Discover',
        text: 'Site survey, listening, and a brief that records what success means for your project.',
      },
      {
        step: '02',
        title: 'Design',
        text: 'Concept, then developed design — 3D views, material boards and a priced furniture list.',
      },
      {
        step: '03',
        title: 'Build',
        text: 'Technical drawings, workshop production and on-site supervision by our own team.',
      },
      {
        step: '04',
        title: 'Hand over',
        text: 'Styling, snagging and a maintenance file. We stay reachable after the ribbon is cut.',
      },
    ],
    journalEyebrow: 'Journal',
    journalHeading: 'Notes from the studio',
    allArticles: 'All articles →',
    ctaHeading: 'Have a space in mind?',
    ctaText:
      "Tell us about the site, the budget and the timeline. We'll tell you honestly what's possible — usually within two working days.",
    ctaButton: 'Start a project',
  },
  about: {
    eyebrow: 'The studio',
    h1: 'Designers and makers, one team',
    lede: `We are an ${SITE.tagline.toLowerCase()} practice: thirty designers, joiners and site supervisors who take spaces from first sketch to the last cushion.`,
    workshopAlt: 'Inside the FORMA Studio workshop',
    storyEyebrow: 'Our story',
    storyHeading: 'Founded around a workbench, not a boardroom',
    story: [
      'FORMA began twelve years ago with two designers and a three-person carpentry shop making restaurant furniture. Clients kept asking who would design the room around the tables — and the studio grew in that direction.',
      'Today we deliver residential, hospitality, workplace and retail projects across Vietnam, with our own workshop producing the joinery and casegoods for most of them. That loop — design, make, install, learn — is the whole point of the practice.',
      'We stay deliberately mid-sized: small enough that a partner reviews every drawing, large enough to build a 40-room homestay without subcontracting the thinking.',
    ],
    believeEyebrow: 'What we believe',
    believeHeading: 'How we practise',
    values: [
      {
        title: 'Honest materials',
        text: 'We specify what we can stand behind — real timbers, traceable stone, fabrics that age well in this climate.',
      },
      {
        title: 'Buildable design',
        text: 'Every drawing leaves the studio priced and producible by our partner workshop. Beautiful on paper is not enough.',
      },
      {
        title: 'One team, one contract',
        text: 'Designers and makers sit in the same room, so nothing is lost between the drawing and the joinery.',
      },
      {
        title: 'After handover',
        text: 'We document every piece we make and stay on call. Furniture is a 20-year relationship, not a delivery.',
      },
    ],
    proofHeading: 'See the proof, not the pitch',
    proofText:
      'The best way to judge a design practice is the work. Browse the gallery, then bring us a site.',
    viewProjects: 'View projects',
    contactUs: 'Contact us',
  },
  contact: {
    eyebrow: 'Contact',
    h1: "Let's talk about your space",
    lede:
      "A few lines about the site and what you're planning is enough to start. We reply to every enquiry within two working days.",
    nameLabel: 'Name *',
    phoneLabel: 'Phone / Zalo *',
    emailLabel: 'Email',
    typeLabel: 'Project type',
    typeOptions: [
      'Residential',
      'Café / restaurant / bar',
      'Hotel / homestay',
      'Office',
      'Retail',
      'Other',
    ],
    budgetLabel: 'Budget range',
    budgetOptions: [
      'Under 1 billion VND',
      '1 – 3 billion VND',
      '3 – 7 billion VND',
      '7 – 15 billion VND',
      'Over 15 billion VND',
      'Not sure yet',
    ],
    messageLabel: 'About the project *',
    messagePlaceholder: 'Location, floor area, current state of the site, timeline…',
    consent:
      'I agree to be contacted about this enquiry. My details are used only to respond and are never shared. *',
    send: 'Send enquiry',
    sending: 'Sending…',
    studioHeading: 'Studio',
    directHeading: 'Direct',
    visitingHeading: 'Visiting?',
    visitingText:
      "Our workshop and material library welcome clients on weekday afternoons — mention it in your message and we'll arrange a tour.",
    msgUnconfigured:
      "The form isn't configured yet — please email {email} or call {phone} instead.",
    msgBot: 'Your message was sent. Thank you.',
    msgSuccess: 'Thank you — your enquiry is on its way. We reply within two working days.',
    msgError: 'Something went wrong sending your message. Please try again, or email us directly.',
    msgNoConnection: 'No connection — please check your network and try again, or email us directly.',
  },
  projects: {
    eyebrow: 'Portfolio',
    h1: 'The project gallery',
    lede: (n: number) =>
      `${n} projects across homes, cafés and restaurants, workplaces and retail. Use the filters to find work similar to yours.`,
    filterGroup: 'Filter by category',
    all: 'All',
    styleLabel: 'Style',
    allStyles: 'All styles',
    areaLabel: 'Floor area',
    anySize: 'Any size',
    searchLabel: 'Search',
    searchPlaceholder: 'Project name or location…',
    countTemplate: 'Showing {v} of {n} projects',
    clear: 'Clear filters',
    emptyHeading: 'No projects match those filters',
    emptyText: 'Try clearing the search or widening the area range.',
    cardMetaTemplate: '{location} · {area} m² · {style}',
  },
  project: {
    breadcrumbHome: 'Home',
    breadcrumbProjects: 'Projects',
    galleryAria: 'Project photo gallery',
    photoAriaTemplate: 'Open photo {i} of {title}',
    photoAltTemplate: '{title} — photo {i}',
    placeholderNote:
      'Placeholder illustrations — click any image to open the lightbox. Real project photography drops into the same slots.',
    metaLabels: {
      client: 'Client',
      location: 'Location',
      area: 'Floor area',
      style: 'Style',
      year: 'Year',
      services: 'Services',
      investment: 'Investment',
    },
    prev: '← Previous',
    next: 'Next →',
    relatedTemplate: 'More {category} projects',
    ctaHeading: 'Planning something similar?',
    ctaButton: 'Talk to our team',
  },
  journal: {
    readArticle: 'Read article →',
    allArticles: '← All articles',
  },
  notFound: {
    h1: 'This page has moved out',
    text: "The page you're looking for doesn't exist — but plenty of finished rooms do.",
    cta: 'Browse projects',
  },
};

export type UIStrings = typeof en;

const vi: UIStrings = {
  nav: {
    projects: 'Dự án',
    studio: 'Studio',
    journal: 'Tạp chí',
    contact: 'Liên hệ',
    startProject: 'Bắt đầu dự án',
    toggleMenu: 'Mở/đóng menu',
    language: 'Ngôn ngữ',
  },
  footer: {
    explore: 'Khám phá',
    allProjects: 'Tất cả dự án',
    practice: 'Lĩnh vực',
    contact: 'Liên hệ',
    hours: 'Thứ 2 – Thứ 7, 8:30 – 18:00',
    rights: 'Bảo lưu mọi quyền.',
    byline: 'Nội thất · Đồ gỗ · Thiết kế – Thi công',
  },
  meta: {
    home: {
      title: `${SITE.name} — ${SITE.tagline}`,
      description:
        'FORMA Studio là studio thiết kế nội thất và đồ gỗ tại Việt Nam — không gian dân dụng, khách sạn, văn phòng và bán lẻ, từ ý tưởng đến thi công trọn gói.',
    },
    about: {
      title: 'Studio',
      description:
        'FORMA Studio là studio thiết kế nội thất và đồ gỗ tại Việt Nam — nhà thiết kế, thợ mộc và giám sát công trình trong cùng một đội ngũ.',
    },
    contact: {
      title: 'Liên hệ',
      description:
        'Bắt đầu dự án với FORMA Studio — cho chúng tôi biết về mặt bằng, ngân sách và thời gian của bạn, chúng tôi sẽ phản hồi trong vòng hai ngày làm việc.',
    },
    projects: {
      title: 'Dự án',
      description:
        'Xem thư viện công trình dân dụng, khách sạn, văn phòng và bán lẻ của chúng tôi. Lọc theo loại hình, phong cách thiết kế hoặc diện tích sàn.',
    },
    journal: {
      title: 'Tạp chí',
      description:
        'Ghi chép từ thực tiễn FORMA Studio — vật liệu, quy trình và bài học từ những công trình đã bàn giao.',
    },
    notFound: { title: 'Không tìm thấy trang' },
  },
  home: {
    srTitle: `${SITE.name} — hồ sơ ${SITE.tagline.toLowerCase()}`,
    featuredLabel: 'Dự án tiêu biểu',
    pause: 'Tạm dừng trình chiếu',
    play: 'Tiếp tục trình chiếu',
    heroAltSuffix: 'hình ảnh đại diện',
    statsLabels: ['Dự án đã bàn giao', 'Năm kinh nghiệm', 'Thiết kế & thợ mộc', 'm² hoàn thiện'],
    selectedWork: 'Công trình chọn lọc',
    viewProject: 'Xem dự án',
    proudHeading: 'Những dự án chúng tôi tự hào',
    allProjects: 'Tất cả dự án →',
    filterGroup: 'Lọc theo loại hình',
    all: 'Tất cả',
    servicesEyebrow: 'Chúng tôi làm gì',
    servicesHeading: 'Từ bản phác đầu tiên đến lần hoàn thiện cuối cùng',
    services: [
      {
        title: 'Kiến trúc nội thất',
        text: 'Từ ý tưởng đến bản vẽ thi công — mặt bằng, ánh sáng, vật liệu và chi tiết mộc được giải quyết triệt để trước khi bắt đầu xây dựng.',
      },
      {
        title: 'Nội thất & đồ gỗ',
        text: 'Các món đồ thiết kế riêng, được làm mẫu và sản xuất tại xưởng đối tác — từ một chiếc bàn đến cả bộ nội thất.',
      },
      {
        title: 'Thiết kế – thi công trọn gói',
        text: 'Bàn giao chìa khóa trao tay với một đội ngũ chịu trách nhiệm về thiết kế, chi phí và tiến độ đến khi hoàn tất.',
      },
      {
        title: 'Tư vấn & khảo sát khả thi',
        text: 'Mặt bằng, ngân sách và thử nghiệm ý tưởng cho nhà đầu tư trước khi ký hợp đồng thuê — để quyết định dựa trên con số.',
      },
    ],
    processEyebrow: 'Cách chúng tôi làm việc',
    processHeading: 'Quy trình xây dựng trên sự tin tưởng',
    processIntro:
      'Phần lớn khách hàng đang lần đầu đầu tư vào một không gian. Quy trình của chúng tôi minh bạch có chủ đích — bạn luôn biết bước tiếp theo là gì, chi phí bao nhiêu và ai chịu trách nhiệm.',
    process: [
      {
        step: '01',
        title: 'Khảo sát',
        text: 'Khảo sát hiện trạng, lắng nghe và lập brief ghi lại điều gì là thành công cho dự án của bạn.',
      },
      {
        step: '02',
        title: 'Thiết kế',
        text: 'Ý tưởng, rồi phát triển thiết kế — phối cảnh 3D, bảng vật liệu và danh mục nội thất có báo giá.',
      },
      {
        step: '03',
        title: 'Thi công',
        text: 'Bản vẽ kỹ thuật, sản xuất tại xưởng và giám sát thi công bởi chính đội ngũ của chúng tôi.',
      },
      {
        step: '04',
        title: 'Bàn giao',
        text: 'Hoàn thiện, xử lý lỗi và hồ sơ bảo trì. Chúng tôi vẫn luôn sẵn sàng sau lễ cắt băng.',
      },
    ],
    journalEyebrow: 'Tạp chí',
    journalHeading: 'Ghi chép từ studio',
    allArticles: 'Tất cả bài viết →',
    ctaHeading: 'Bạn đã có một không gian trong đầu?',
    ctaText:
      'Hãy cho chúng tôi biết về mặt bằng, ngân sách và thời gian. Chúng tôi sẽ tư vấn thẳng thắn những gì có thể làm — thường trong vòng hai ngày làm việc.',
    ctaButton: 'Bắt đầu dự án',
  },
  about: {
    eyebrow: 'Về studio',
    h1: 'Nhà thiết kế và người thợ, một đội ngũ',
    lede:
      'Chúng tôi là studio thiết kế nội thất & đồ gỗ: ba mươi nhà thiết kế, thợ mộc và giám sát công trình đưa không gian từ bản phác đầu tiên đến chiếc gối cuối cùng.',
    workshopAlt: 'Bên trong xưởng mộc FORMA Studio',
    storyEyebrow: 'Câu chuyện của chúng tôi',
    storyHeading: 'Khởi nguồn từ một bàn thợ, không phải phòng họp',
    story: [
      'FORMA bắt đầu mười hai năm trước với hai nhà thiết kế và một xưởng mộc ba người chuyên làm đồ cho nhà hàng. Khách hàng cứ hỏi ai sẽ thiết kế không gian quanh những chiếc bàn — và studio lớn lên theo hướng đó.',
      'Hôm nay chúng tôi thực hiện các dự án dân dụng, khách sạn, văn phòng và bán lẻ trên khắp Việt Nam, với xưởng riêng sản xuất đồ mộc cho phần lớn trong số đó. Vòng lặp đó — thiết kế, chế tạo, lắp đặt, rút kinh nghiệm — là toàn bộ ý nghĩa của nghề này.',
      'Chúng tôi cố ý giữ quy mô vừa: đủ nhỏ để một đối tác sáng lập duyệt từng bản vẽ, đủ lớn để hoàn thiện một homestay 40 phòng mà không thuê ngoài khâu tư duy.',
    ],
    believeEyebrow: 'Điều chúng tôi tin',
    believeHeading: 'Cách chúng tôi làm nghề',
    values: [
      {
        title: 'Vật liệu trung thực',
        text: 'Chúng tôi chỉ chỉ định những gì có thể bảo hành — gỗ thật, đá truy xuất được nguồn gốc, vải bền với khí hậu này.',
      },
      {
        title: 'Thiết kế khả thi',
        text: 'Mọi bản vẽ rời studio đều đã được định giá và sản xuất được bởi xưởng đối tác. Đẹp trên giấy là chưa đủ.',
      },
      {
        title: 'Một đội ngũ, một hợp đồng',
        text: 'Nhà thiết kế và người thợ ngồi cùng phòng, nên không gì bị thất lạc giữa bản vẽ và xưởng mộc.',
      },
      {
        title: 'Sau bàn giao',
        text: 'Chúng tôi lưu hồ sơ từng món đồ và luôn ở lại hỗ trợ. Nội thất là mối quan hệ 20 năm, không phải một lần giao hàng.',
      },
    ],
    proofHeading: 'Xem công trình, không nghe lời hứa',
    proofText:
      'Cách tốt nhất để đánh giá một studio thiết kế là chính các công trình. Xem thư viện, rồi mang mặt bằng của bạn đến chúng tôi.',
    viewProjects: 'Xem dự án',
    contactUs: 'Liên hệ',
  },
  contact: {
    eyebrow: 'Liên hệ',
    h1: 'Hãy nói về không gian của bạn',
    lede:
      'Vài dòng về mặt bằng và điều bạn đang lên kế hoạch là đủ để bắt đầu. Chúng tôi trả lời mọi yêu cầu trong vòng hai ngày làm việc.',
    nameLabel: 'Họ tên *',
    phoneLabel: 'Điện thoại / Zalo *',
    emailLabel: 'Email',
    typeLabel: 'Loại hình dự án',
    typeOptions: [
      'Nhà ở',
      'Cà phê / nhà hàng / quán bar',
      'Khách sạn / homestay',
      'Văn phòng',
      'Bán lẻ',
      'Khác',
    ],
    budgetLabel: 'Ngân sách',
    budgetOptions: [
      'Dưới 1 tỷ VND',
      '1 – 3 tỷ VND',
      '3 – 7 tỷ VND',
      '7 – 15 tỷ VND',
      'Trên 15 tỷ VND',
      'Chưa xác định',
    ],
    messageLabel: 'Về dự án *',
    messagePlaceholder: 'Vị trí, diện tích sàn, hiện trạng mặt bằng, thời gian…',
    consent:
      'Tôi đồng ý được liên hệ về yêu cầu này. Thông tin của tôi chỉ dùng để phản hồi và không bao giờ chia sẻ. *',
    send: 'Gửi yêu cầu',
    sending: 'Đang gửi…',
    studioHeading: 'Studio',
    directHeading: 'Trực tiếp',
    visitingHeading: 'Ghé thăm?',
    visitingText:
      'Xưởng và thư viện vật liệu chào đón khách vào buổi chiều các ngày trong tuần — nhắc trong tin nhắn và chúng tôi sẽ sắp xếp cho bạn tham quan.',
    msgUnconfigured: 'Biểu mẫu chưa được cấu hình — hãy gửi email {email} hoặc gọi {phone}.',
    msgBot: 'Tin nhắn của bạn đã được gửi. Cảm ơn.',
    msgSuccess: 'Cảm ơn — yêu cầu của bạn đã được gửi. Chúng tôi phản hồi trong vòng hai ngày làm việc.',
    msgError: 'Có lỗi khi gửi tin nhắn. Vui lòng thử lại hoặc gửi email trực tiếp.',
    msgNoConnection: 'Không có kết nối — kiểm tra mạng rồi thử lại, hoặc gửi email trực tiếp.',
  },
  projects: {
    eyebrow: 'Hồ sơ công trình',
    h1: 'Thư viện dự án',
    lede: (n: number) =>
      `${n} dự án trải rộng từ nhà ở, cà phê – nhà hàng, văn phòng đến bán lẻ. Dùng bộ lọc để tìm công trình tương tự của bạn.`,
    filterGroup: 'Lọc theo loại hình',
    all: 'Tất cả',
    styleLabel: 'Phong cách',
    allStyles: 'Mọi phong cách',
    areaLabel: 'Diện tích sàn',
    anySize: 'Mọi diện tích',
    searchLabel: 'Tìm kiếm',
    searchPlaceholder: 'Tên dự án hoặc địa điểm…',
    countTemplate: 'Hiển thị {v} trên {n} dự án',
    clear: 'Xóa bộ lọc',
    emptyHeading: 'Không có dự án nào khớp bộ lọc',
    emptyText: 'Thử xóa từ khóa hoặc mở rộng khoảng diện tích.',
    cardMetaTemplate: '{location} · {area} m² · {style}',
  },
  project: {
    breadcrumbHome: 'Trang chủ',
    breadcrumbProjects: 'Dự án',
    galleryAria: 'Thư viện ảnh dự án',
    photoAriaTemplate: 'Mở ảnh {i} của {title}',
    photoAltTemplate: '{title} — ảnh {i}',
    placeholderNote:
      'Ảnh minh họa — bấm vào ảnh để mở lightbox. Ảnh chụp thật sẽ được thay vào đúng các vị trí này.',
    metaLabels: {
      client: 'Chủ đầu tư',
      location: 'Địa điểm',
      area: 'Diện tích sàn',
      style: 'Phong cách',
      year: 'Năm',
      services: 'Dịch vụ',
      investment: 'Mức đầu tư',
    },
    prev: '← Dự án trước',
    next: 'Dự án sau →',
    relatedTemplate: 'Thêm dự án {category} khác',
    ctaHeading: 'Đang ưng một công trình tương tự?',
    ctaButton: 'Trò chuyện với đội ngũ',
  },
  journal: {
    readArticle: 'Đọc bài viết →',
    allArticles: '← Tất cả bài viết',
  },
  notFound: {
    h1: 'Trang này đã đổi địa chỉ',
    text: 'Trang bạn tìm không tồn tại — nhưng nhiều không gian đã hoàn thành thì có.',
    cta: 'Xem dự án',
  },
};

/** UI strings by locale. VI is type-checked against the EN shape. */
export const UI: Record<Locale, UIStrings> = { en, vi };
