// script.js
(function () {
  const months = REPORT_DATA.months;
  // default to 2026/02 to mirror the reference screenshots (falls back to first month if absent)
  let currentMonth = months.includes("2026/02") ? "2026/02" : months[0];

  const monthSelect = document.getElementById("monthSelect");
  const tooltip = document.createElement("div");
  tooltip.className = "tooltip";
  document.body.appendChild(tooltip);

  // ---------- helpers ----------
  function pct(part, whole) {
    if (!whole) return "0.0%";
    return (part / whole * 100).toFixed(1) + "%";
  }
  function pctNum(part, whole) {
    if (!whole) return 0;
    return part / whole * 100;
  }
  function sumConsultants(monthKey) {
    const rows = REPORT_DATA.consultants[monthKey];
    return rows.reduce((acc, r) => {
      acc.assigned += r.assigned;
      acc.contacted += r.contacted;
      acc.meetings += r.meetings;
      return acc;
    }, { assigned: 0, contacted: 0, meetings: 0 });
  }
  function prevMonthKey(monthKey) {
    const idx = months.indexOf(monthKey);
    return idx > 0 ? months[idx - 1] : null;
  }

  // ---------- month select ----------
  months.forEach(m => {
    const opt = document.createElement("option");
    opt.value = m;
    opt.textContent = m;
    monthSelect.appendChild(opt);
  });
  monthSelect.value = currentMonth;
  monthSelect.addEventListener("change", () => {
    currentMonth = monthSelect.value;
    render();
  });

  document.getElementById("lastUpdated").textContent = REPORT_DATA.lastUpdated;

  // ---------- KPI cards ----------
  function renderKPI() {
    const totals = sumConsultants(currentMonth);
    const total = totals.assigned;
    const uncontacted = total - totals.contacted;
    const contactedNoMeeting = totals.contacted - totals.meetings;
    const meetings = totals.meetings;

    const cards = [
      { cls: "total", label: "總名單數", value: total, pctText: null },
      { cls: "uncontacted", label: "未接觸", value: uncontacted, pctText: pct(uncontacted, total) },
      { cls: "contacted", label: "已接觸未開會", value: contactedNoMeeting, pctText: pct(contactedNoMeeting, total) },
      { cls: "meeting", label: "已開會", value: meetings, pctText: pct(meetings, total), link: true }
    ];

    const grid = document.getElementById("kpiGrid");
    grid.innerHTML = "";
    cards.forEach(c => {
      const div = document.createElement("div");
      div.className = "kpi-card " + c.cls;
      div.innerHTML = `
        <div class="kpi-label">
          <span>${c.label}</span>
          ${c.link ? '<span class="kpi-link" id="toggleMeetingDetail">✓ 查看明細</span>' : ""}
        </div>
        <div class="kpi-value">${c.value}</div>
        ${c.pctText ? `<div class="kpi-pct">${c.pctText}</div>` : ""}
      `;
      grid.appendChild(div);
    });

    const toggleBtn = document.getElementById("toggleMeetingDetail");
    if (toggleBtn) toggleBtn.addEventListener("click", toggleMeetingDetailPanel);
  }

  function renderMeetingDetailTable() {
    const rows = REPORT_DATA.meetingDetails[currentMonth] || [];
    const body = document.getElementById("meetingDetailBody");
    body.innerHTML = "";
    rows.forEach(r => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${r.client}</td>
        <td>${r.consultant}</td>
        <td>${r.source}</td>
        <td>${r.date}</td>
      `;
      body.appendChild(tr);
    });
  }

  function toggleMeetingDetailPanel() {
    const panel = document.getElementById("meetingDetailPanel");
    const isHidden = panel.classList.contains("hidden");
    if (isHidden) {
      renderMeetingDetailTable();
      panel.classList.remove("hidden");
      document.getElementById("toggleMeetingDetail").textContent = "✕ 收合明細";
    } else {
      panel.classList.add("hidden");
      const btn = document.getElementById("toggleMeetingDetail");
      if (btn) btn.textContent = "✓ 查看明細";
    }
  }

  // ---------- MoM cards ----------
  function renderMoM() {
    const prev = prevMonthKey(currentMonth);
    document.getElementById("momRange").textContent = prev
      ? `(${currentMonth} vs ${prev})`
      : "(無上月資料)";

    const grid = document.getElementById("momGrid");
    grid.innerHTML = "";

    const curTotals = sumConsultants(currentMonth);
    const curTotal = curTotals.assigned;
    const curUncontacted = curTotal - curTotals.contacted;
    const curContactedNoMeeting = curTotals.contacted - curTotals.meetings;
    const curMeetings = curTotals.meetings;

    const rows = [
      { label: "總名單數", cur: curTotal },
      { label: "未接觸", cur: curUncontacted },
      { label: "已接觸未開會", cur: curContactedNoMeeting },
      { label: "已開會", cur: curMeetings }
    ];

    if (!prev) {
      rows.forEach(r => {
        const div = document.createElement("div");
        div.className = "mom-card";
        div.innerHTML = `
          <div class="mom-label">${r.label}</div>
          <div class="mom-value">${r.cur}</div>
          <div class="mom-change flat">無上月資料可比較</div>
        `;
        grid.appendChild(div);
      });
      return;
    }

    const prevTotals = sumConsultants(prev);
    const prevTotal = prevTotals.assigned;
    const prevUncontacted = prevTotal - prevTotals.contacted;
    const prevContactedNoMeeting = prevTotals.contacted - prevTotals.meetings;
    const prevMeetings = prevTotals.meetings;

    const prevVals = [prevTotal, prevUncontacted, prevContactedNoMeeting, prevMeetings];

    rows.forEach((r, i) => {
      const prevVal = prevVals[i];
      const diff = r.cur - prevVal;
      const diffPct = prevVal ? (diff / prevVal * 100) : 0;
      const dirClass = diff > 0 ? "up" : diff < 0 ? "down" : "flat";
      const arrow = diff > 0 ? "▲" : diff < 0 ? "▼" : "—";
      const div = document.createElement("div");
      div.className = "mom-card";
      div.innerHTML = `
        <div class="mom-label">${r.label}</div>
        <div class="mom-value">${r.cur}<span class="mom-vs">vs ${prevVal}</span></div>
        <div class="mom-change ${dirClass}">${arrow} ${Math.abs(diff)} (${diffPct > 0 ? "+" : ""}${diffPct.toFixed(0)}%)</div>
      `;
      grid.appendChild(div);
    });
  }

  // ---------- consultant table ----------
  function renderTable() {
    document.getElementById("consultantTitle").textContent = `${currentMonth}`;
    const rows = REPORT_DATA.consultants[currentMonth];
    const body = document.getElementById("consultantBody");
    body.innerHTML = "";
    rows.forEach(r => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${r.name}</td>
        <td>${r.assigned}</td>
        <td>${r.contacted}</td>
        <td class="rate-cell">${pct(r.contacted, r.assigned)}</td>
        <td>${r.meetings}</td>
        <td class="rate-cell">${pct(r.meetings, r.assigned)}</td>
      `;
      body.appendChild(tr);
    });
    const totals = sumConsultants(currentMonth);
    const foot = document.getElementById("consultantFoot");
    foot.innerHTML = `
      <tr>
        <td>總計</td>
        <td>${totals.assigned}</td>
        <td>${totals.contacted}</td>
        <td class="rate-cell">${pct(totals.contacted, totals.assigned)}</td>
        <td>${totals.meetings}</td>
        <td class="rate-cell">${pct(totals.meetings, totals.assigned)}</td>
      </tr>
    `;
  }

  // ---------- bar chart renderer ----------
  function renderBarChart(containerId, dataObj, colorClass, maxOverride) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";
    const entries = Object.entries(dataObj);
    const max = maxOverride || Math.max(...entries.map(e => e[1]));
    const niceMax = Math.ceil(max / 9) * 9 || 9;

    entries.forEach(([label, value]) => {
      const row = document.createElement("div");
      row.className = "bar-row";
      const widthPct = (value / niceMax * 100).toFixed(1);
      row.innerHTML = `
        <div class="bar-label">${label}</div>
        <div class="bar-track">
          <div class="bar-fill ${colorClass}" style="width:${widthPct}%"
               data-label="${label}" data-value="${value}"></div>
        </div>
        <div class="bar-value">${value}</div>
      `;
      container.appendChild(row);
    });

    // axis
    const axis = document.createElement("div");
    axis.className = "bar-axis";
    const ticks = [0, niceMax * 0.25, niceMax * 0.5, niceMax * 0.75, niceMax];
    axis.innerHTML = `<div></div><div class="axis-ticks">${ticks.map(t => `<span>${Math.round(t)}</span>`).join("")}</div><div></div>`;
    container.appendChild(axis);

    // tooltip events
    container.querySelectorAll(".bar-fill").forEach(bar => {
      bar.addEventListener("mousemove", (e) => {
        tooltip.textContent = `${bar.dataset.label}：${bar.dataset.value} 筆`;
        tooltip.style.left = e.clientX + "px";
        tooltip.style.top = e.clientY + "px";
        tooltip.classList.add("show");
      });
      bar.addEventListener("mouseleave", () => tooltip.classList.remove("show"));
    });
  }

  // ---------- deep analysis ----------
  function renderDeepAnalysis() {
    // 名單來源
    const sources = REPORT_DATA.leadSources[currentMonth];
    document.getElementById("sourceChartTitle").textContent = `名單來源分佈（${currentMonth}）`;
    renderBarChart("sourceChart", sources, "source");

    const totals = sumConsultants(currentMonth);
    const insight = REPORT_DATA.meetingSourceInsight[currentMonth];
    document.getElementById("insightTopSource").innerHTML =
      `📈 本月會議主要來源：<strong>${insight.topSource}</strong>（${totals.meetings > 0 ? Math.round(totals.meetings * insight.topSourceRate / 100) : 0} 筆 / 佔本月全部會議 ${insight.topSourceRate}%）`;
    document.getElementById("insightBestSource").innerHTML =
      `📈 本月最高轉化來源：<strong>${insight.bestConvertSource}</strong>（開會率 ${insight.bestConvertRate}%）`;

    // 未接觸原因
    const reasons = REPORT_DATA.uncontactedReasons[currentMonth];
    document.getElementById("reasonChartTitle").textContent = `未接觸原因分佈（${currentMonth}）`;
    renderBarChart("reasonChart", reasons, "reason");

    const uncontactedTotal = Object.values(reasons).reduce((a, b) => a + b, 0);
    const topReasonEntry = Object.entries(reasons).sort((a, b) => b[1] - a[1])[0];
    document.getElementById("insightReason").innerHTML =
      `⚠️ 本月最大未接觸原因：<strong>${topReasonEntry[0]}</strong>（共 ${topReasonEntry[1]} 筆，佔本月未接觸 ${pct(topReasonEntry[1], uncontactedTotal)}）`;

    const list = document.getElementById("reasonList");
    list.innerHTML = "";
    Object.entries(reasons).forEach(([label, value]) => {
      const item = document.createElement("div");
      item.className = "reason-item";
      item.innerHTML = `<span>${label}</span><strong>${value} 筆</strong>`;
      list.appendChild(item);
    });
  }

  // ---------- tabs ----------
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      document.querySelectorAll(".tab-panel").forEach(p => p.classList.add("hidden"));
      document.getElementById("panel-" + btn.dataset.tab).classList.remove("hidden");
    });
  });

  // ---------- meeting detail panel close button (static element) ----------
  document.getElementById("closeDetailBtn").addEventListener("click", () => {
    document.getElementById("meetingDetailPanel").classList.add("hidden");
    const btn = document.getElementById("toggleMeetingDetail");
    if (btn) btn.textContent = "✓ 查看明細";
  });

  // ---------- main render ----------
  function render() {
    document.getElementById("meetingDetailPanel").classList.add("hidden");
    renderKPI();
    renderMoM();
    renderTable();
    renderDeepAnalysis();
  }

  render();
})();
