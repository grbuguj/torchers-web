import { useState, useEffect, useRef, useCallback } from "react";

const FONT = "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Noto+Sans+KR:wght@300;400;500;700;800;900&family=DM+Mono:wght@400;500&display=swap";

const C = {
  bg: "#f7f8fa", white: "#fff", black: "#0f0f0f",
  blue: "#2563eb", bluePale: "#eff6ff", blueMid: "#bfdbfe",
  gray100: "#f3f4f6", gray200: "#e5e7eb", gray400: "#9ca3af", gray500: "#6b7280",
};

const R = ({ children, d = 0, style = {} }) => {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => e.isIntersecting && setV(true), { threshold: 0.1 });
    ref.current && o.observe(ref.current);
    return () => o.disconnect();
  }, []);
  return (
    <div ref={ref} style={{
      opacity: v ? 1 : 0, transform: v ? "none" : "translateY(36px)",
      transition: `opacity 0.75s cubic-bezier(0.16,1,0.3,1) ${d}s, transform 0.75s cubic-bezier(0.16,1,0.3,1) ${d}s`, ...style,
    }}>{children}</div>
  );
};

const MagBtn = ({ children, href, filled, onClick, style = {} }) => {
  const ref = useRef(null);
  const [p, setP] = useState({ x: 0, y: 0 });
  const move = useCallback(e => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    setP({ x: (e.clientX - r.left - r.width / 2) * 0.12, y: (e.clientY - r.top - r.height / 2) * 0.12 });
  }, []);
  const base = {
    display: "inline-flex", alignItems: "center", gap: 6,
    padding: "14px 30px", borderRadius: 56, fontSize: 15, fontWeight: 600,
    fontFamily: "'Noto Sans KR', sans-serif", cursor: "pointer",
    textDecoration: "none", transition: "box-shadow 0.3s, background 0.3s, border-color 0.3s",
    transform: `translate(${p.x}px, ${p.y}px)`,
    ...(filled
      ? { background: C.blue, color: "#fff", border: "none", boxShadow: `0 2px 24px ${C.blue}28` }
      : { background: "transparent", color: C.black, border: `1.5px solid ${C.gray200}` }),
    ...style,
  };
  const Tag = href ? "a" : "button";
  const extra = href ? { href, target: "_blank", rel: "noopener noreferrer" } : { onClick };
  return (
    <Tag ref={ref} style={base} onMouseMove={move} onMouseLeave={() => setP({ x: 0, y: 0 })}
      onMouseEnter={e => { if (filled) e.currentTarget.style.boxShadow = `0 6px 36px ${C.blue}40`; else e.currentTarget.style.borderColor = C.blue; }}
      onMouseOut={e => { if (filled) e.currentTarget.style.boxShadow = `0 2px 24px ${C.blue}28`; else e.currentTarget.style.borderColor = C.gray200; }}
      {...extra}>{children}</Tag>
  );
};

const Ticker = () => (
  <div style={{ overflow: "hidden", padding: "18px 0", borderTop: `1px solid ${C.gray200}`, borderBottom: `1px solid ${C.gray200}`, background: C.white }}>
    <div style={{ display: "flex", gap: 72, whiteSpace: "nowrap", width: "max-content", animation: "ticker 28s linear infinite" }}>
      {[...Array(2)].flatMap((_, k) =>
        ["TREND → SERVICE", "BUILD FAST", "VALIDATE WITH REELS", "ITERATE", "횃불이유괴단"].map((t, i) => (
          <span key={`${k}-${i}`} style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(16px, 2.2vw, 26px)",
            fontWeight: 800, letterSpacing: 1.5,
            color: i % 2 === 0 ? "transparent" : C.blue,
            WebkitTextStroke: i % 2 === 0 ? `1.2px ${C.gray400}` : "none",
          }}>{t}</span>
        ))
      )}
    </div>
  </div>
);

const Nav = () => {
  const [s, setS] = useState(false);
  useEffect(() => { const f = () => setS(window.scrollY > 80); window.addEventListener("scroll", f); return () => window.removeEventListener("scroll", f); }, []);
  const go = id => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 999,
      padding: s ? "14px 28px" : "22px 28px",
      background: s ? "rgba(247,248,250,0.82)" : "transparent",
      backdropFilter: s ? "blur(20px) saturate(180%)" : "none",
      borderBottom: s ? `1px solid ${C.gray200}` : "none",
      transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
    }}>
      <div style={{ maxWidth: 1080, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 17, color: C.blue, cursor: "pointer",
        }}>횃불이유괴단</span>
        <div style={{ display: "flex", gap: 28 }} className="nd">
          {[["about", "About"], ["team", "Team"], ["projects", "Work"], ["instagram", "Instagram"], ["contact", "Join"]].map(([id, l]) => (
            <button key={id} onClick={() => go(id)} style={{
              background: "none", border: "none", cursor: "pointer", padding: 0,
              fontFamily: "'DM Mono', monospace", fontSize: 13, fontWeight: 500,
              color: C.gray500, transition: "color 0.2s",
            }} onMouseEnter={e => e.target.style.color = C.blue} onMouseLeave={e => e.target.style.color = C.gray500}>{l}</button>
          ))}
        </div>
      </div>
    </nav>
  );
};

const Hero = () => {
  const words = ["트렌드를", "아이디어를", "바이럴을"];
  const [i, setI] = useState(0);
  const [show, setShow] = useState(true);
  useEffect(() => {
    const t = setInterval(() => { setShow(false); setTimeout(() => { setI(x => (x + 1) % words.length); setShow(true); }, 300); }, 2600);
    return () => clearInterval(t);
  }, []);
  return (
    <section style={{
      minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center",
      padding: "140px 28px 80px", position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", inset: 0, opacity: 0.3, backgroundImage: `radial-gradient(circle, ${C.gray200} 1px, transparent 1px)`, backgroundSize: "30px 30px" }} />
      <div style={{ position: "absolute", top: "8%", right: "-6%", width: 520, height: 520, borderRadius: "50%", background: `radial-gradient(circle, ${C.bluePale}, transparent 70%)`, filter: "blur(60px)", animation: "drift 10s ease-in-out infinite" }} />
      <div style={{ maxWidth: 1080, margin: "0 auto", width: "100%", position: "relative", display: "flex", alignItems: "center", gap: 48, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 480px" }}>

        <R d={0.08}>
          <h1 style={{
            fontFamily: "'Noto Sans KR', sans-serif", fontSize: "clamp(36px, 5.5vw, 68px)",
            fontWeight: 900, lineHeight: 1.1, margin: "0 0 24px", letterSpacing: -2, color: C.black,
          }}>
            <span style={{
              color: C.blue, display: "inline-block", minWidth: "2.5ch",
              opacity: show ? 1 : 0, transform: show ? "translateY(0)" : "translateY(-16px)",
              transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
            }}>{words[i]}</span><br />
            서비스로 만들다.
          </h1>
        </R>
        <R d={0.16}>
          <p style={{ fontSize: 17, color: C.gray500, maxWidth: 400, lineHeight: 1.75, margin: "0 0 40px" }}>
            2주 안에 만들고, 릴스로 검증합니다.<br />반응이 있으면 이어가고, 없으면 다음으로 넘어갑니다.
          </p>
        </R>
        <R d={0.24}>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <MagBtn filled onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}>프로젝트 보기</MagBtn>
            <MagBtn onClick={() => alert("현재는 지원 기간이 아닙니다.\n다음 모집은 인스타그램(@torch.ers)에서 안내드리겠습니다.")}>지원하기 →</MagBtn>
          </div>
        </R>
        </div>
        <R d={0.3} style={{ flex: "0 1 360px" }}>
          <div style={{
            borderRadius: 24, overflow: "hidden", border: `1px solid ${C.gray200}`,
            boxShadow: "0 8px 40px rgba(0,0,0,0.06)",
            transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1), box-shadow 0.5s",
            cursor: "default",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px) rotate(-1deg)"; e.currentTarget.style.boxShadow = "0 20px 60px rgba(0,0,0,0.1)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 8px 40px rgba(0,0,0,0.06)"; }}
          >
            <img src="/poster.png" alt="횃불이유괴단 포스터" style={{ width: "100%", height: "auto", display: "block" }} />
          </div>
        </R>
      </div>
    </section>
  );
};

const About = () => (
  <section id="about" style={{ padding: "120px 28px" }}>
    <div style={{ maxWidth: 1080, margin: "0 auto" }}>
      <R><p style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: C.blue, letterSpacing: 3, textTransform: "uppercase", marginBottom: 14, fontWeight: 500 }}>About</p></R>
      <R d={0.06}>
        <h2 style={{ fontFamily: "'Noto Sans KR', sans-serif", fontSize: "clamp(26px, 4vw, 42px)", fontWeight: 900, margin: "0 0 16px", letterSpacing: -1, lineHeight: 1.25 }}>
          만들어봐야 알 수 있는 것들이 있습니다.
        </h2>
      </R>
      <R d={0.1}>
        <p style={{ fontSize: 16, color: C.gray500, maxWidth: 500, lineHeight: 1.75, margin: "0 0 52px" }}>
          횃불이유괴단은 트렌드를 서비스로 바꾸는 팀입니다.<br />
          짧은 주기로 빠르게 만들고, 실제 반응을 확인하는 방식으로 일합니다.
        </p>
      </R>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
        {[
          { num: "01", title: "빠른 실행", body: "오래 고민하기보다 일단 만들어봅니다. 기획은 짧게, 실행은 빠르게." },
          { num: "02", title: "2주 스프린트", body: "하나의 프로젝트에 2주를 집중합니다. 핵심 기능에만 집중하고, 나머지는 반응을 보고 결정합니다." },
          { num: "03", title: "릴스로 검증", body: "만든 서비스는 릴스로 공개합니다. 조회수와 반응이 다음 방향을 결정합니다." },
        ].map((c, i) => (
          <R key={i} d={0.1 + i * 0.08}>
            <div style={{
              padding: "32px 28px", borderRadius: 20, background: C.white, border: `1px solid ${C.gray200}`,
              transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)", cursor: "default", height: "100%",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.blue; e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = `0 16px 40px rgba(37,99,235,0.06)`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.gray200; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
              <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 44, fontWeight: 800, color: C.blueMid, marginBottom: 20, lineHeight: 1 }}>{c.num}</div>
              <h3 style={{ fontSize: 19, fontWeight: 800, margin: "0 0 10px", color: C.black }}>{c.title}</h3>
              <p style={{ fontSize: 15, color: C.gray500, lineHeight: 1.7, margin: 0 }}>{c.body}</p>
            </div>
          </R>
        ))}
      </div>

    </div>
  </section>
);

const TeamRow = ({ label, color, members }) => (
  <div style={{ marginBottom: 40 }}>
    <R>
      <div style={{
        display: "inline-block", padding: "6px 18px", borderRadius: 100, marginBottom: 18,
        background: `${color}12`, border: `1px solid ${color}30`,
        fontFamily: "'DM Mono', monospace", fontSize: 12, fontWeight: 600, color, letterSpacing: 1, textTransform: "uppercase",
      }}>{label}</div>
    </R>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 14 }}>
      {members.map((m, i) => (
        <R key={i} d={i * 0.06}>
          <div style={{
            padding: "26px 22px", borderRadius: 16, background: C.bg,
            border: `1px solid ${C.gray200}`, transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)",
            cursor: "default", opacity: m.empty ? 0.5 : 1,
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(-3px)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.gray200; e.currentTarget.style.opacity = m.empty ? "0.5" : "1"; e.currentTarget.style.transform = "none"; }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: color, marginBottom: 18 }} />
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, fontWeight: 500, color, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>{m.role}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: m.empty ? C.gray400 : C.black }}>{m.name}</div>
            {m.links && (
              <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 6 }}>
                {m.links.map((l, j) => (
                  <a key={j} href={l.href} target={l.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" style={{
                    fontFamily: "'DM Mono', monospace", fontSize: 12, color: C.gray500,
                    textDecoration: "none", transition: "color 0.2s", display: "flex", alignItems: "center", gap: 6,
                  }}
                    onMouseEnter={e => e.currentTarget.style.color = C.blue}
                    onMouseLeave={e => e.currentTarget.style.color = C.gray500}
                  >
                    <span style={{ fontSize: 11, color: C.gray400, minWidth: 42 }}>{l.label}</span>{l.text}
                  </a>
                ))}
              </div>
            )}
          </div>
        </R>
      ))}
    </div>
  </div>
);

const Team = () => (
  <section id="team" style={{ padding: "120px 28px", background: C.white }}>
    <div style={{ maxWidth: 1080, margin: "0 auto" }}>
      <R><p style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: C.blue, letterSpacing: 3, textTransform: "uppercase", marginBottom: 14, fontWeight: 500 }}>Team</p></R>
      <R d={0.06}><h2 style={{ fontFamily: "'Noto Sans KR', sans-serif", fontSize: "clamp(26px, 4vw, 42px)", fontWeight: 900, margin: "0 0 48px", letterSpacing: -1 }}>함께 만드는 사람들</h2></R>

      <TeamRow label="Developer" color={C.blue} members={[
        { name: "김재웅", role: "Developer · 팀장", links: [
            { label: "Email", href: "mailto:bugs0613@naver.com", text: "bugs0613@naver.com" },
            { label: "Tel", href: "tel:010-4622-2849", text: "010-4622-2849" },
            { label: "GitHub", href: "https://github.com/grbuguj", text: "grbuguj" },
          ] },
        { name: "안재일", role: "Developer · 부팀장", links: [
            { label: "Email", href: "mailto:a090066@gmail.com", text: "a090066@gmail.com" },
            { label: "Tel", href: "tel:010-3030-9703", text: "010-3030-9703" },
            { label: "GitHub", href: "https://github.com/jaeiling", text: "jaeiling" },
          ] },
        { name: "정지인", role: "Developer", links: [
            { label: "Email", href: "mailto:cki08543@gmail.com", text: "cki08543@gmail.com" },
            { label: "Tel", href: "tel:010-6228-5167", text: "010-6228-5167" },
        { label: "GitHub", href: "https://github.com/jiin-jung", text: "jiin-jung" },
          ] },
        { name: "임완렬", role: "Developer", links: [
            { label: "Email", href: "mailto:limwr706@gmail.com", text: "limwr706@gmail.com" },
            { label: "Tel", href: "tel:010-2531-2167", text: "010-2531-2167" },
            { label: "GitHub", href: "https://github.com", text: "예정" },
          ] }
      ]} />

    <TeamRow label="Marketer" color="#f59e0b" members={[
        { name: "신예림", role: "Marketer", links: [
                { label: "Email", href: "mailto:yerim03722@naver.com", text: "yerim03722@naver.com" },
                { label: "Tel", href: "tel:010-9097-8604", text: "010-9097-8604" },
                { label: "Link", href: "#", text: "예정" },
            ] },
        { name: "장원일", role: "Marketer", links: [
                { label: "Email", href: "mailto:aaa3094412@gmail.com", text: "aaa3094412@gmail.com" },
                { label: "Tel", href: "tel:010-3993-6585", text: "010-3993-6585" },
                { label: "Link", href: "#", text: "예정" },
            ] },
        { name: "이준범", role: "Marketer", links: [
                { label: "Email", href: "mailto:bluedog04@daum.net", text: "bluedog04@daum.net" },
                { label: "Tel", href: "tel:010-7603-0998", text: "010-7603-0998" },
                { label: "Link", href: "#", text: "예정" },
            ] },
    ]} />

    </div>
  </section>
);

const Projects = () => (
  <section id="projects" style={{ padding: "120px 28px" }}>
    <div style={{ maxWidth: 1080, margin: "0 auto" }}>
      <R><p style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: C.blue, letterSpacing: 3, textTransform: "uppercase", marginBottom: 14, fontWeight: 500 }}>Work</p></R>
      <R d={0.06}><h2 style={{ fontFamily: "'Noto Sans KR', sans-serif", fontSize: "clamp(26px, 4vw, 42px)", fontWeight: 900, margin: "0 0 48px", letterSpacing: -1 }}>프로젝트</h2></R>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
        {[1, 2, 3].map(n => (
          <R key={n} d={n * 0.08}>
            <div style={{
              borderRadius: 20, border: `2px dashed ${C.gray200}`, padding: 44,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              minHeight: 240, transition: "all 0.35s", cursor: "default",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.blue; e.currentTarget.style.background = C.bluePale; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.gray200; e.currentTarget.style.background = "transparent"; }}>
              <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 56, fontWeight: 800, color: C.gray200, lineHeight: 1, marginBottom: 14 }}>
                {String(n).padStart(2, "0")}
              </div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, color: C.gray400 }}>Coming Soon</div>
            </div>
          </R>
        ))}
      </div>
      <R d={0.3}>
        <div style={{ marginTop: 28, padding: "18px 24px", borderRadius: 14, background: C.bluePale, border: `1px solid ${C.blueMid}`, textAlign: "center" }}>
          <p style={{ fontSize: 14, color: C.blue, fontWeight: 600, margin: 0 }}>첫 번째 프로젝트를 준비하고 있습니다.</p>
        </div>
      </R>
    </div>
  </section>
);

const Instagram = () => {
  const embedRef = useRef(null);
  useEffect(() => {
    const existing = document.querySelector('script[src*="instagram.com/embed.js"]');
    if (existing) { if (window.instgrm) window.instgrm.Embeds.process(); return; }
    const s = document.createElement("script");
    s.src = "https://www.instagram.com/embed.js";
    s.async = true;
    s.onload = () => { if (window.instgrm) window.instgrm.Embeds.process(); };
    document.body.appendChild(s);
  }, []);

  return (
    <section id="instagram" style={{ padding: "120px 28px", background: C.white }}>
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        <R><p style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: C.blue, letterSpacing: 3, textTransform: "uppercase", marginBottom: 14, fontWeight: 500 }}>Instagram</p></R>
        <R d={0.06}>
          <h2 style={{ fontFamily: "'Noto Sans KR', sans-serif", fontSize: "clamp(26px, 4vw, 42px)", fontWeight: 900, margin: "0 0 16px", letterSpacing: -1 }}>@torch.ers</h2>
        </R>
        <R d={0.1}>
          <p style={{ fontSize: 16, color: C.gray500, lineHeight: 1.75, margin: "0 0 40px" }}>
            프로젝트 소식과 릴스를 올리는 공식 계정입니다.
          </p>
        </R>
        <R d={0.16}>
          <div style={{ display: "flex", gap: 32, flexWrap: "wrap", alignItems: "flex-start" }}>
            <div ref={embedRef} style={{ flex: "1 1 400px", maxWidth: 540 }}
              dangerouslySetInnerHTML={{ __html: `<blockquote class="instagram-media" data-instgrm-captioned data-instgrm-permalink="https://www.instagram.com/p/DVr4-doEvwY/?utm_source=ig_embed&amp;utm_campaign=loading" data-instgrm-version="14" style="background:#FFF; border:0; border-radius:12px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin:0; max-width:540px; min-width:326px; padding:0; width:100%;"><div style="padding:16px;"><a href="https://www.instagram.com/p/DVr4-doEvwY/?utm_source=ig_embed&amp;utm_campaign=loading" style="background:#FFFFFF; line-height:0; padding:0 0; text-align:center; text-decoration:none; width:100%;" target="_blank"><div style="display:flex; flex-direction:row; align-items:center;"><div style="background-color:#F4F4F4; border-radius:50%; flex-grow:0; height:40px; margin-right:14px; width:40px;"></div><div style="display:flex; flex-direction:column; flex-grow:1; justify-content:center;"><div style="background-color:#F4F4F4; border-radius:4px; flex-grow:0; height:14px; margin-bottom:6px; width:100px;"></div><div style="background-color:#F4F4F4; border-radius:4px; flex-grow:0; height:14px; width:60px;"></div></div></div><div style="padding:19% 0;"></div><div style="display:block; height:50px; margin:0 auto 12px; width:50px;"><svg width="50px" height="50px" viewBox="0 0 60 60" version="1.1" xmlns="https://www.w3.org/2000/svg"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g transform="translate(-511.000000, -20.000000)" fill="#000000"><g><path d="M556.869,30.41 C554.814,30.41 553.148,32.076 553.148,34.131 C553.148,36.186 554.814,37.852 556.869,37.852 C558.924,37.852 560.59,36.186 560.59,34.131 C560.59,32.076 558.924,30.41 556.869,30.41 M541,60.657 C535.114,60.657 530.342,55.887 530.342,50 C530.342,44.114 535.114,39.342 541,39.342 C546.887,39.342 551.658,44.114 551.658,50 C551.658,55.887 546.887,60.657 541,60.657 M541,33.886 C532.1,33.886 524.886,41.1 524.886,50 C524.886,58.899 532.1,66.113 541,66.113 C549.9,66.113 557.115,58.899 557.115,50 C557.115,41.1 549.9,33.886 541,33.886 M565.378,62.101 C565.244,65.022 564.756,66.606 564.346,67.663 C563.803,69.06 563.154,70.057 562.106,71.106 C561.058,72.155 560.06,72.803 558.662,73.347 C557.607,73.757 556.021,74.244 553.102,74.378 C549.944,74.521 548.997,74.552 541,74.552 C533.003,74.552 532.056,74.521 528.898,74.378 C525.979,74.244 524.393,73.757 523.338,73.347 C521.94,72.803 520.942,72.155 519.894,71.106 C518.846,70.057 518.197,69.06 517.654,67.663 C517.244,66.606 516.755,65.022 516.623,62.101 C516.479,58.943 516.448,57.996 516.448,50 C516.448,42.003 516.479,41.056 516.623,37.899 C516.755,34.978 517.244,33.391 517.654,32.338 C518.197,30.938 518.846,29.942 519.894,28.894 C520.942,27.846 521.94,27.196 523.338,26.654 C524.393,26.244 525.979,25.756 528.898,25.623 C532.057,25.479 533.004,25.448 541,25.448 C548.997,25.448 549.943,25.479 553.102,25.623 C556.021,25.756 557.607,26.244 558.662,26.654 C560.06,27.196 561.058,27.846 562.106,28.894 C563.154,29.942 563.803,30.938 564.346,32.338 C564.756,33.391 565.244,34.978 565.378,37.899 C565.522,41.056 565.552,42.003 565.552,50 C565.552,57.996 565.522,58.943 565.378,62.101 M570.82,37.631 C570.674,34.438 570.167,32.258 569.425,30.349 C568.659,28.377 567.633,26.702 565.965,25.035 C564.297,23.368 562.623,22.342 560.652,21.575 C558.743,20.834 556.562,20.326 553.369,20.18 C550.169,20.033 549.148,20 541,20 C532.853,20 531.831,20.033 528.631,20.18 C525.438,20.326 523.257,20.834 521.349,21.575 C519.376,22.342 517.703,23.368 516.035,25.035 C514.368,26.702 513.342,28.377 512.574,30.349 C511.834,32.258 511.326,34.438 511.181,37.631 C511.035,40.831 511,41.851 511,50 C511,58.147 511.035,59.17 511.181,62.369 C511.326,65.562 511.834,67.743 512.574,69.651 C513.342,71.625 514.368,73.296 516.035,74.965 C517.703,76.634 519.376,77.658 521.349,78.425 C523.257,79.167 525.438,79.673 528.631,79.82 C531.831,79.965 532.853,80.001 541,80.001 C549.148,80.001 550.169,79.965 553.369,79.82 C556.562,79.673 558.743,79.167 560.652,78.425 C562.623,77.658 564.297,76.634 565.965,74.965 C567.633,73.296 568.659,71.625 569.425,69.651 C570.167,67.743 570.674,65.562 570.82,62.369 C570.966,59.17 571,58.147 571,50 C571,41.851 570.966,40.831 570.82,37.631"></path></g></g></g></svg></div><div style="padding-top:8px;"><div style="color:#3897f0; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:550; line-height:18px;">Instagram에서 이 게시물 보기</div></div><div style="padding:12.5% 0;"></div></a><p style="color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; line-height:17px; margin-bottom:0; margin-top:8px; overflow:hidden; padding:8px 0 7px; text-align:center; text-overflow:ellipsis; white-space:nowrap;"><a href="https://www.instagram.com/p/DVr4-doEvwY/" style="color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:normal; line-height:17px; text-decoration:none;" target="_blank">횃불이유괴단(@torch.ers)님의 공유 게시물</a></p></div></blockquote>` }} />
            <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 20 }}>
              <div style={{ padding: "28px 24px", borderRadius: 16, background: C.bg, border: `1px solid ${C.gray200}` }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: C.blue, letterSpacing: 1, textTransform: "uppercase", marginBottom: 10, fontWeight: 500 }}>Official Account</div>
                <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>@torch.ers</div>
                <p style={{ fontSize: 14, color: C.gray500, lineHeight: 1.6, margin: "0 0 20px" }}>
                  프로젝트 과정, 릴스, 비하인드를 기록합니다.
                </p>
                <MagBtn href="https://www.instagram.com/torch.ers/" filled style={{ fontSize: 14, padding: "12px 24px" }}>
                  팔로우하기
                </MagBtn>
              </div>
            </div>
          </div>
        </R>
      </div>
    </section>
  );
};

const Contact = () => (
  <section id="contact" style={{ padding: "120px 28px" }}>
    <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
      <R><p style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: C.blue, letterSpacing: 3, textTransform: "uppercase", marginBottom: 14, fontWeight: 500 }}>Join</p></R>
      <R d={0.06}>
        <h2 style={{ fontFamily: "'Noto Sans KR', sans-serif", fontSize: "clamp(26px, 5vw, 44px)", fontWeight: 900, lineHeight: 1.2, margin: "0 0 18px", letterSpacing: -1 }}>
          직접 만들어보고 싶다면<br /><span style={{ color: C.blue }}>함께해요.</span>
        </h2>
      </R>
      <R d={0.12}>
        <p style={{ fontSize: 16, color: C.gray500, lineHeight: 1.75, margin: "0 0 36px" }}>
          전공이나 학년은 상관없습니다.<br />같이 만들어보고 싶은 분이면 충분합니다.
        </p>
      </R>
      <R d={0.18}>
        <MagBtn filled onClick={() => alert("현재는 지원 기간이 아닙니다.\n다음 모집은 인스타그램(@torch.ers)에서 안내드리겠습니다.")}>지원 마감</MagBtn>
      </R>
    </div>
    <div style={{
      maxWidth: 1080, margin: "96px auto 0", paddingTop: 24,
      borderTop: `1px solid ${C.gray200}`, display: "flex",
      justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12,
    }}>
      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: C.gray400 }}>© 2026 횃불이유괴단</span>
      <a href="https://www.instagram.com/torch.ers/" target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: C.gray400, textDecoration: "none", transition: "color 0.2s" }}
        onMouseEnter={e => e.target.style.color = C.blue} onMouseLeave={e => e.target.style.color = C.gray400}>
        @torch.ers
      </a>
    </div>
  </section>
);

export default function App() {
  return (
    <div style={{ background: C.bg, color: C.black, fontFamily: "'Noto Sans KR', sans-serif", minHeight: "100vh", overflowX: "hidden" }}>
      <link href={FONT} rel="stylesheet" />
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        ::selection{background:${C.blue};color:#fff}
        html{scroll-behavior:smooth}
        @keyframes drift{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-25px,-18px) scale(1.04)}}
        @keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
        @media(max-width:640px){.nd{display:none!important}}
      `}</style>
      <Nav />
      <Hero />
      <Ticker />
      <About />
      <Team />
      <Projects />
      <Instagram />
      <Contact />
    </div>
  );
}
