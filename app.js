const $ = (sel, node = document) => node.querySelector(sel);
const byId = (id) => document.getElementById(id);
const h = (value = '') => String(value ?? '').replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money = (cents) => (Number(cents || 0)/100).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const dateToday = () => {const d = new Date(); return new Date(d.getTime() - d.getTimezoneOffset()*60000).toISOString().slice(0,10)};
const dateBR = (date) => {if(!date) return '—';const [y,m,d]=date.split('-');return `${d}/${m}/${y}`};
const id = () => (globalThis.crypto?.randomUUID?.() || `local_${Date.now()}_${Math.random().toString(36).slice(2)}`);
const normalizeName = (value) => String(value || '').trim().replace(/\s+/g,' ');
const slugName = (name) => normalizeName(name).toLocaleLowerCase('pt-BR');
const safeNumber = (n) => Number.isFinite(Number(n)) ? Number(n) : 0;
const ui = {
  calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18"/>',
  list:'<path d="M8 6h13M8 12h13M8 18h13"/><path d="M3 6h.01M3 12h.01M3 18h.01"/>',
  users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  coins:'<circle cx="12" cy="12" r="9"/><path d="M15 8.5c-.6-.8-1.4-1.1-3-1.1-2 0-3 1-3 2.2 0 3 6 1 6 4 0 1.3-1 2.3-3 2.3-1.3 0-2.2-.3-3-1.1M12 5v14"/>',
  chart:'<path d="M3 3v18h18M7 16v-4M12 16V7M17 16v-7"/>',
  tag:'<path d="M20 12 12 20 4 12V4h8z"/><circle cx="8.5" cy="8.5" r="1"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  edit:'<path d="m16 4 4 4M4 20l4.2-.9L20 7.3a2 2 0 0 0-3.3-3.3L4.9 15.8z"/>',
  x:'<path d="M18 6 6 18M6 6l12 12"/>',
  check:'<path d="m5 12 4 4L19 6"/>',
  download:'<path d="M12 3v12m0 0 5-5m-5 5-5-5M4 16v4h16v-4"/>',
  copy:'<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
  search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
  cloud:'<path d="M20 16.6A5 5 0 0 0 19 7a7 7 0 0 0-13.7 1.5A4.5 4.5 0 0 0 7 17.5h12"/>',
  shield:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/>',
  info:'<circle cx="12" cy="12" r="10"/><path d="M12 11v6M12 7h.01"/>',
  logout:'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
  print:'<path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 14h12v8H6z"/>',
  plate:'<path d="M3 17h18M5 17a7 7 0 0 1 14 0M12 10V8M3 21h18"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  refresh:'<path d="M20 7v5h-5M4 17v-5h5"/><path d="M6.4 9A7 7 0 0 1 19 7l1 5M4 12l1 5a7 7 0 0 0 12.6-2"/>',
  lock:'<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
  key:'<circle cx="8" cy="15" r="4"/><path d="m11 12 9-9h2v4h-3v3h-3v3h-3"/>'
};
const icon = (name) => `<svg viewBox="0 0 24 24" aria-hidden="true">${ui[name] || ui.info}</svg>`;
const initialSizes = [
  {id:'eco',label:'Econômica (Eco)',short_label:'Eco',price_cents:1200,active:true,sort_order:0},
  {id:'media',label:'Média (M)',short_label:'M',price_cents:1500,active:true,sort_order:1},
  {id:'p',label:'Pequena (P)',short_label:'P',price_cents:1800,active:true,sort_order:2}
];
const STORAGE='marmitas_nexa_local_v1';
const CONFIG_STORAGE='marmitas_nexa_cloud_v1';
function localSeed(){
  const day = dateToday();
  const sample=[['Nicole','eco','sem cebola'],['Guilherme','media',''],['Giovani','p',''],['Cristiano','eco','']];
  const orders=sample.map(([employee_name,size_id,notes])=>{const s=initialSizes.find(s=>s.id===size_id);return {id:id(),order_date:day,employee_name,size_id,size_label:s.label,size_short_label:s.short_label,qty:1,unit_price_cents:s.price_cents,notes,status:'active',created_by_name:'Responsável 1',created_at:new Date().toISOString()}});
  const past=[['2026-09-15','Nicole','eco'],['2026-09-15','Giovani','p'],['2026-09-29','Nicole','eco'],['2026-09-29','Giovani','p'],['2026-09-29','Evandro','p'],['2026-09-30','Nicole','eco'],['2026-09-30','Guilherme','media'],['2026-09-30','Giovani','p'],['2026-09-30','Cristiano','eco']];
  past.forEach(([order_date,employee_name,size_id])=>{const s=initialSizes.find(s=>s.id===size_id);orders.push({id:id(),order_date,employee_name,size_id,size_label:s.label,size_short_label:s.short_label,qty:1,unit_price_cents:s.price_cents,notes:'',status:'active',created_by_name:'Responsável 2',created_at:new Date().toISOString()})});
  return {orders,sizes:structuredClone(initialSizes),events:[]};
}
function getLocal(){try{const raw=localStorage.getItem(STORAGE);if(raw){const data=JSON.parse(raw);if(Array.isArray(data.orders)&&Array.isArray(data.sizes))return data}}catch(e){}const seeded=localSeed();try{localStorage.setItem(STORAGE,JSON.stringify(seeded))}catch(e){console.warn('Armazenamento local indisponível:',e)}return seeded}
let realtimeChannel = null;
let state={mode:'local',view:'pedidos',date:dateToday(),month:dateToday().slice(0,7),query:'',showCancelled:false,operator:'Responsável 1',localUser:null,users:[],profile:null,sb:null,cloudConfig:null,cloudError:'',busy:false,data:getLocal(),selectedEmployee:null,reportCompany:(()=>{try{return localStorage.getItem('nexa_marmitas_report_company')||''}catch(e){return ''}})()};
const savedConfig=(() => {try{return JSON.parse(localStorage.getItem(CONFIG_STORAGE))}catch(e){return null}})();
const deployConfig=globalThis.MARMITAS_CONFIG;
if(deployConfig?.url && deployConfig?.key)state.cloudConfig=deployConfig;
else if(savedConfig?.url&&savedConfig?.key)state.cloudConfig=savedConfig;
const isFinance=()=>state.mode==='cloud'?state.profile?.role==='financeiro':state.localUser?.role==='financeiro';
const isAdmin=()=>state.mode==='cloud'?state.profile?.role==='admin':state.localUser?.role==='admin';
const canWrite=()=>state.mode==='cloud'?['admin','operador'].includes(state.profile?.role):['admin','operador'].includes(state.localUser?.role);
const canEditOrders=()=>isAdmin();
const isOperator=()=>!isAdmin()&&!isFinance();
const canSeeFinance=()=>isAdmin()||isFinance();
const todayForOperator=()=>{if(isOperator())state.date=dateToday();};
const orders=()=>state.data.orders || [];
const sizes=()=>[...(state.data.sizes||[])].sort((a,b)=>a.sort_order-b.sort_order);
const activeOrders=(items)=>items.filter(o=>o.status!=='cancelled');
const qty=(items)=>items.reduce((a,o)=>a+safeNumber(o.qty),0);
const total=(items)=>items.reduce((a,o)=>a+safeNumber(o.qty)*safeNumber(o.unit_price_cents),0);
const matchingDate=(date)=>orders().filter(o=>o.order_date===date);
const matchingMonth=(month)=>orders().filter(o=>o.order_date?.startsWith(month));
function saveLocal(){try{localStorage.setItem(STORAGE,JSON.stringify(state.data))}catch(e){console.warn('Não foi possível salvar os dados locais:',e);toast('Atenção: o navegador bloqueou o armazenamento. Seus dados podem não persistir.') }}
function toast(message){const box=byId('toast');box.innerHTML=`<div>${h(message)}</div>`;clearTimeout(toast.timer);toast.timer=setTimeout(()=>{box.innerHTML=''},4200)}
function errorMessage(err){return err?.message||String(err||'Erro desconhecido')}
const roleLabel=(role)=>({admin:'Administrador',operador:'Funcionário · pedidos do dia',financeiro:'Financeiro (consulta)'}[role]||'Usuário');
function roleName(){return roleLabel(state.mode==='cloud'?state.profile?.role:state.localUser?.role)}
function userName(){return state.mode==='cloud'?(state.profile?.display_name||'Usuário'):(state.localUser?.display_name||'Usuário')}
function sizeShort(s){return s.short_label||s.label||'—'}
function getOrderSize(o){return o.size_short_label || sizes().find(s=>s.id===o.size_id)?.short_label || o.size_label || '—'}
function sizeClass(o){return /eco/i.test(getOrderSize(o))?'eco':/mé|\bm\b/i.test(getOrderSize(o))?'media':/\bp\b/i.test(getOrderSize(o))?'p':''}
function emitLocalEvent(action,before,after){state.data.events=state.data.events||[];state.data.events.unshift({id:id(),order_id:after?.id||before?.id,action,actor_name:userName(),recorded_at:new Date().toISOString(),before_data:before||null,after_data:after||null});saveLocal()}
function dispatchRender(){byId('app').innerHTML=layoutHtml();updateCurrentPage()}
function layoutHtml(){
  const navigation=[['pedidos','list','Pedidos do dia'],...(canSeeFinance()?[['financeiro','coins','Financeiro'],['historico','calendar','Histórico']]:[]),...(isAdmin()?[['valores','tag','Cadastro de marmitas'],['usuarios','users','Usuários e acessos']]:[])];
  return `<div class="layout"><aside class="sidebar"><div class="brand"><img class="brand-logo" src="./nexa-marmitas-logo.webp" alt="Nexa Marmitas"><div><strong>Nexa Marmitas</strong><span>CONTROLE DE PEDIDOS</span></div></div><nav class="nav" aria-label="Navegação principal">${navigation.map(([name,ic,label])=>`<button type="button" data-action="nav" data-view="${name}" class="${state.view===name?'active':''}">${icon(ic)}<span>${label}</span></button>`).join('')}</nav><div class="sidebar-bottom"><div class="small-overline">Controle seguro</div><strong>Pedido por funcionário</strong><p>Datas, tamanhos e valores organizados para o financeiro consultar sem precisar perguntar novamente.</p></div></aside><div class="main"><header class="topbar"><div><div class="overline">GESTÃO DE REFEIÇÕES</div><h1>Controle de marmitas</h1></div><div class="topbar-actions"><span class="pill ${state.mode==='cloud'?'cloud':'local'}">${icon(state.mode==='cloud'?'cloud':'info')}${state.mode==='cloud'?'Online':'Teste local'}</span><button class="user-chip" type="button" data-action="account" title="Conta e conexão"><div class="user-avatar">${h(userName().slice(0,1).toUpperCase())}</div><div><strong>${h(userName())}</strong><span>${h(roleName())}</span></div></button></div></header><main class="content" id="page-content"></main></div></div>`
}
function intro(title,subtitle,actions=''){return `<div class="page-intro"><div><h2>${h(title)}</h2><p>${h(subtitle)}</p></div><div class="actions">${actions}</div></div>`}
function notice(){return state.mode==='local'?`<div class="notice">${icon('info')}<div><strong>Prévia sem login:</strong> dados somente neste navegador, sem proteção de acesso e sem sincronização. Para operação real, conecte o Supabase.</div><button type="button" data-action="connect">Conectar</button></div>`:''}
function stat(label,value,ic,tone=''){return `<div class="stat-card"><div class="stat-icon ${tone}">${icon(ic)}</div><div><label>${h(label)}</label><strong>${h(value)}</strong></div></div>`}
function empty(title,subtitle){return `<div class="empty">${icon('plate')}<strong>${h(title)}</strong><p>${h(subtitle)}</p></div>`}
function prettyMonth(ym){if(!/^\d{4}-\d{2}$/.test(ym))return ym;return new Date(`${ym}-02T12:00:00`).toLocaleDateString('pt-BR',{month:'long',year:'numeric'})}
function orderRow(o){const buttons=canEditOrders()?`<div class="table-tools"><button class="btn icon-btn" title="Editar pedido" aria-label="Editar pedido" data-action="edit" data-id="${h(o.id)}">${icon('edit')}</button><button class="btn icon-btn danger" title="Cancelar pedido" aria-label="Cancelar pedido" data-action="cancel" data-id="${h(o.id)}">${icon('x')}</button></div>`:'<span class="muted">Somente leitura</span>';
 return `<tr class="${o.status==='cancelled'?'cancelled':''}"><td><strong>${h(o.employee_name)}</strong><div class="muted" style="font-size:10px;margin-top:4px">${h(o.created_by_name||'—')}</div></td><td>${h(o.qty)}</td><td><span class="tag ${sizeClass(o)}">${h(getOrderSize(o))}</span></td>${canSeeFinance()?`<td>${money(o.unit_price_cents)}</td>`:''}<td style="min-width:130px;white-space:normal;max-width:220px">${h(o.notes||'—')}</td>${canSeeFinance()?`<td><strong>${money(o.unit_price_cents*o.qty)}</strong>${o.status==='cancelled'?'<div><span class="tag cancelled">Cancelado</span></div>':''}</td>`:''}<td>${o.status==='cancelled'?'<span class="muted">—</span>':buttons}</td></tr>`}
function screenPedidos(){
  todayForOperator();const all=matchingDate(state.date), current=activeOrders(all), singles=new Set(current.map(o=>slugName(o.employee_name)));
  const activeSizes=sizes().filter(s=>s.active);
  const grouped=new Map();current.forEach(o=>{const key=getOrderSize(o);grouped.set(key,(grouped.get(key)||0)+Number(o.qty))});
  const unique=[...new Set(orders().map(o=>normalizeName(o.employee_name)))].filter(Boolean).sort((a,b)=>a.localeCompare(b,'pt-BR'));
  const last=activeOrders([...orders()].filter(o=>o.order_date!==state.date)).sort((a,b)=>b.order_date.localeCompare(a.order_date)).slice(0,5);
  const monthItems=canSeeFinance()?activeOrders(matchingMonth(state.month)):[];
  const monthGroups=canSeeFinance()?groupForSupplier(monthItems):[];

  return intro('Pedidos do dia','Cadastre o pedido uma vez. O financeiro já pode consultar por data e por funcionário.',`<div class="date-filter"><label for="day-select">Data</label><input class="input" type="date" id="day-select" value="${h(state.date)}" ${isOperator()?'disabled title="Funcionários registram apenas pedidos de hoje"':''}></div><button class="btn" data-action="refresh">${icon('refresh')} Atualizar</button>`)+notice()+
  `<div class="stats">${stat('Marmitas no dia',String(qty(current)),'plate')}${stat('Funcionários atendidos',String(singles.size),'users','green')}${canSeeFinance()?stat('Valor total do dia',money(total(current)),'coins','secondary'):''}${stat('Tamanhos registrados',String(grouped.size),'tag','navy')}</div>`+
  `<div class="two-col"><div class="stack">${canWrite()?`<section class="panel"><div class="panel-head"><div><h3>Adicionar marmita</h3><p>Informe nome, quantidade e tamanho. O preço é preenchido automaticamente.</p></div><button class="btn slim" data-action="paste-list">${icon('copy')} Colar lista do WhatsApp</button></div><div class="panel-body"><form id="order-form" class="add-form"><div class="field"><label for="employee">Nome do funcionário</label><input id="employee" class="input" list="employees-list" maxlength="100" placeholder="Ex.: Nicole" autocomplete="off" required><datalist id="employees-list">${unique.map(n=>`<option value="${h(n)}"></option>`).join('')}</datalist></div><div class="field"><label for="order-size">Tamanho da marmita</label><select id="order-size" class="input" required>${activeSizes.map(s=>`<option value="${h(s.id)}">${h(s.label)}</option>`).join('')}</select></div><div class="field"><label for="quantity">Quantidade</label><input id="quantity" type="number" min="1" max="99" step="1" value="1" class="input" required></div>${canSeeFinance()?`<div class="field"><label>Valor unitário</label><div id="price-preview" class="price-preview">${money(activeSizes[0]?.price_cents||0)}<span class="subtext">Preço cadastrado</span></div></div>`:''}<div class="field notes-field"><label for="notes">Pedido / observações (opcional)</label><input id="notes" class="input" maxlength="500" placeholder="Ex.: sem feijão, só frango..."></div><div class="submit-field"><button class="btn primary" type="submit" ${!activeSizes.length?'disabled':''}>${icon('plus')} Salvar pedido</button></div></form></div></section>`:''}
    <section class="panel"><div class="panel-head"><div><h3>Relação de pedidos</h3><p>${dateBR(state.date)} • ${qty(current)} marmita(s) • ${current.length} lançamento(s)</p></div><div class="actions"><button class="btn slim" data-action="copy-day">${icon('copy')} Copiar lista</button>${canSeeFinance()?`<button class="btn slim" data-action="csv-day">${icon('download')} CSV</button>`:''}${canSeeFinance()?`<button class="btn slim" data-action="toggle-cancelled">${state.showCancelled?'Ocultar':'Ver'} cancelados</button>`:''}</div></div>${(canSeeFinance()&&state.showCancelled?all:current).length?`<div class="table-wrap"><table class="data-table"><thead><tr><th>Funcionário</th><th>Qtd.</th><th>Tamanho</th>${canSeeFinance()?'<th>Unitário</th>':''}<th>Observações</th>${canSeeFinance()?'<th>Total</th>':''}<th></th></tr></thead><tbody>${[...(canSeeFinance()&&state.showCancelled?all:current)].sort((a,b)=>a.employee_name.localeCompare(b.employee_name,'pt-BR')).map(orderRow).join('')}</tbody></table></div>`:empty('Nenhum pedido nesta data','Selecione outra data ou adicione a primeira marmita do dia.')}</section></div>
   <div class="stack"><div class="summary-card"><span class="summary-label">Fechamento do dia</span><div class="big-number">${qty(current)} <small style="font-size:13px;font-weight:600;color:#c1cbdb">marmita(s)</small></div>${[...grouped].map(([name,n])=>`<div class="pair"><span>${h(name)}</span><b>${n}</b></div>`).join('')||'<div class="pair"><span>Sem pedidos ainda</span><b>0</b></div>'}${canSeeFinance()?`<div class="pair"><span>Total estimado</span><b>${money(total(current))}</b></div>`:''}<button class="btn primary" data-action="copy-day">${icon('copy')} Copiar mensagem para fornecedor</button></div>
   ${canSeeFinance()?`<section class="summary-card month-supplier-card" aria-label="Fechamento mensal para fornecedor"><span class="summary-label">Fechamento total do mês</span><div class="month-supplier-selection"><label for="supplier-month">Escolher mês</label><input type="month" id="supplier-month" class="input" value="${h(state.month)}"></div><div class="supplier-month-name">${h(prettyMonth(state.month))}</div><div class="big-number">${qty(monthItems)} <small style="font-size:13px;font-weight:600;color:#c1cbdb">marmita(s)</small></div>${monthGroups.map(g=>`<div class="pair"><span>${h(g.label)}</span><b>${g.quantity}</b></div>`).join('')||'<div class="pair"><span>Nenhum pedido registrado neste mês</span><b>0</b></div>'}<div class="pair supplier-total"><span>Total do mês</span><b>${money(total(monthItems))}</b></div><button class="btn primary" data-action="copy-supplier-month">${icon('copy')} Copiar fechamento do mês para fornecedor</button><button class="btn supplier-report-link" data-action="nav" data-view="financeiro">${icon('calendar')} Ver dias e emitir PDF</button><p class="supplier-note">Somente pedidos ativos. Os valores consideram o preço salvo em cada pedido.</p></section>`:''}
   ${canSeeFinance()?`<section class="panel"><div class="panel-head"><div><h3>Últimos registros</h3><p>Outras datas para consulta</p></div></div>${last.length?`<div class="mini-list">${last.map(o=>`<div class="mini-row"><div><strong>${h(o.employee_name)}</strong><br><small>${dateBR(o.order_date)} • ${h(getOrderSize(o))}</small></div><button class="btn slim" data-action="go-day" data-date="${h(o.order_date)}">Ver dia</button></div>`).join('')}</div>`:empty('Sem histórico','Os pedidos anteriores aparecerão aqui.')}</section>`:''}<div class="helper-card"><strong>Como funciona para o financeiro?</strong><p>Quando o sistema estiver conectado ao banco, os responsáveis registram os pedidos e o financeiro visualiza a mesma lista, com histórico mensal e valores. Não precisa enviar prints pelo WhatsApp.</p></div></div></div>`;
}
// Agrupamento para fornecedor por tamanho salvo em cada pedido; mantém histórico de valores.
function groupForSupplier(list){
 const groups=new Map();
 list.forEach(o=>{
   const label=getOrderSize(o)||o.size_label||'Outros';
   const key=String(label).trim().toLocaleLowerCase('pt-BR');
   const row=groups.get(key)||{label,quantity:0,amount:0};
   row.quantity+=Number(o.qty)||0;
   row.amount+=(Number(o.qty)||0)*(Number(o.unit_price_cents)||0);
   groups.set(key,row);
 });
 return [...groups.values()].sort((a,b)=>a.label.localeCompare(b.label,'pt-BR'));
}
function supplierMonthText(){
 const list=activeOrders(matchingMonth(state.month));
 const groups=groupForSupplier(list);
 const days=new Set(list.map(o=>o.order_date)).size;
 return `FECHAMENTO MENSAL DE MARMITAS — ${prettyMonth(state.month).toUpperCase()}\n${state.reportCompany?.trim()?`Empresa / setor: ${state.reportCompany.trim()}\n`:''}\nRESUMO POR TAMANHO\n${groups.length?groups.map(g=>`${g.label}: ${g.quantity} marmita(s) — ${money(g.amount)}`).join('\n'):'Nenhum pedido registrado no período.'}\n\nTotal de marmitas: ${qty(list)}\nDias com pedidos: ${days}\nVALOR TOTAL DO MÊS: ${money(total(list))}\n\nValores referentes aos pedidos ativos registrados no Nexa Marmitas. Sujeitos à conferência do fornecedor.`;
}
function monthlyGroup(){const list=activeOrders(matchingMonth(state.month)), map=new Map();list.forEach(o=>{const key=slugName(o.employee_name);const entry=map.get(key)||{name:o.employee_name,qty:0,total:0,orders:[],days:new Set()};entry.qty+=Number(o.qty);entry.total+=Number(o.qty)*Number(o.unit_price_cents);entry.orders.push(o);entry.days.add(o.order_date);map.set(key,entry)});return [...map.values()].sort((a,b)=>a.name.localeCompare(b.name,'pt-BR'))}
function financeRows(groups){return groups.map(g=>`<tr><td><strong>${h(g.name)}</strong></td><td>${g.days.size}</td><td>${g.qty}</td><td><strong>${money(g.total)}</strong></td><td><button class="btn slim" data-action="details" data-name="${h(g.name)}">Ver pedidos</button></td></tr>`).join('')}
// Gera todos os dias da competência, inclusive dias sem registros, em anos bissextos.
function monthlyDaily(month=state.month){
 if(!/^\d{4}-(0[1-9]|1[0-2])$/.test(month))return [];
 const [year,monthNumber]=month.split('-').map(Number);
 const lastDay=new Date(year,monthNumber,0).getDate();
 const ordersByDay=new Map();
 activeOrders(matchingMonth(month)).forEach(o=>{
   if(!ordersByDay.has(o.order_date))ordersByDay.set(o.order_date,[]);
   ordersByDay.get(o.order_date).push(o);
 });
 return Array.from({length:lastDay},(_,index)=>{
   const day=index+1;
   const date=`${year}-${String(monthNumber).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
   const items=ordersByDay.get(date)||[];
   return {date,items,quantity:qty(items),amount:total(items),employees:new Set(items.map(o=>slugName(o.employee_name))).size,weekday:new Date(year,monthNumber-1,day,12).toLocaleDateString('pt-BR',{weekday:'short'}).replace('.',''),hasOrders:items.length>0};
 });
}
function reportCompanyName(){return (byId('report-company')?.value??state.reportCompany??'').trim().slice(0,100)}
function screenFinanceiro(){
 const people=monthlyGroup();
 const filtered=people.filter(g=>slugName(g.name).includes(slugName(state.query)));
 const list=activeOrders(matchingMonth(state.month));
 const daily=monthlyDaily();
 const activeDays=daily.filter(d=>d.hasOrders).length;
 const dailyRows=daily.map(d=>`<div class="monthly-ledger-row ${d.hasOrders?'':'no-record'}">
   <div class="ledger-date"><strong>${dateBR(d.date)}</strong><small>${h(d.weekday)}</small></div>
   <div class="ledger-metric"><small>Marmitas</small><strong>${d.quantity}</strong></div>
   <div class="ledger-metric"><small>Funcionários</small><strong>${d.employees}</strong></div>
   <div class="ledger-amount"><small>Valor do dia</small><strong>${money(d.amount)}</strong>${!d.hasOrders?'<span class="ledger-empty">Sem lançamento</span>':''}</div>
   <button class="btn slim ledger-view" data-action="go-day" data-date="${h(d.date)}" aria-label="Ver pedidos de ${dateBR(d.date)}">Ver dia</button>
 </div>`).join('');
 return intro('Fechamento financeiro mensal','Todos os dias do mês, gastos com marmitas e valores por funcionário, prontos para enviar à empresa.',`<button class="btn" data-action="csv-month">${icon('download')} Baixar planilha CSV</button><button class="btn ink" data-action="print">${icon('print')} Salvar em PDF</button><button class="btn" data-action="share-month">${icon('copy')} Compartilhar resumo</button>`)+notice()+
 `<section class="panel monthly-filter-panel"><div class="panel-body monthly-filter-body"><div class="field"><label for="month-select">Selecionar mês do fechamento</label><input type="month" class="input" id="month-select" value="${h(state.month)}" required></div><div class="field company-field"><label for="report-company">Empresa / setor no relatório (opcional)</label><input class="input" type="text" id="report-company" maxlength="100" placeholder="Ex.: ASP" value="${h(state.reportCompany||'')}"></div><div class="month-caption">Competência: <strong>${h(prettyMonth(state.month))}</strong><span>${daily.length} dias no mês</span></div></div></section>`+
 `<div class="stats">${stat('Marmitas registradas',String(qty(list)),'plate')}${stat('Funcionários atendidos',String(people.length),'users','green')}${stat('Gasto total do mês',money(total(list)),'coins','secondary')}${stat('Dias com lançamento',`${activeDays} de ${daily.length}`,'calendar','navy')}</div>`+
 `<section class="panel monthly-ledger-panel"><div class="panel-head"><div><h3>${icon('calendar')} Gastos dia a dia — ${h(prettyMonth(state.month))}</h3><p>Do dia 1 ao último dia do mês, inclusive sem registros. Consulte cada data para ver os pedidos.</p></div><span class="month-count">${daily.length} dias</span></div><div class="monthly-ledger-head"><span>Data</span><span>Marmitas</span><span>Funcionários</span><span>Gasto registrado</span><span>Consultar</span></div><div class="monthly-ledger-list">${dailyRows}</div><div class="monthly-ledger-total"><div><strong>GASTO TOTAL DO MÊS</strong><span>${qty(list)} marmita(s) · ${activeDays} dia(s) com lançamento</span></div><strong>${money(total(list))}</strong></div></section>`+
 `<section class="panel monthly-people-panel"><div class="panel-head"><div><h3>${icon('users')} Valores por funcionário</h3><p>Resumo para conferência do financeiro; os valores são os registrados no pedido, mesmo que os preços mudem depois.</p></div><div class="field"><label for="finance-search">Buscar funcionário</label><input class="input" id="finance-search" placeholder="Nome do funcionário" value="${h(state.query)}"></div></div>${filtered.length?`<div class="table-wrap"><table class="data-table"><thead><tr><th>Funcionário</th><th>Dias com pedido</th><th>Marmitas</th><th>Valor total</th><th>Detalhes</th></tr></thead><tbody>${financeRows(filtered)}</tbody></table></div>`:empty('Sem pedidos neste período','Escolha outra competência ou outro funcionário.')}</section>`+
 `<p class="footnote">O fechamento considera somente pedidos ativos cadastrados no sistema. Dias sem lançamento não comprovam ausência de consumo. Valores são gastos registrados, não necessariamente descontos em folha ou pagamentos à fornecedora.</p>`;
}
function screenHistorico(){
 const active=activeOrders(matchingMonth(state.month)); const dates=[...new Set(active.map(o=>o.order_date))].sort((a,b)=>b.localeCompare(a));const filtered=dates.map(date=>({date,items:active.filter(o=>o.order_date===date)}));
 const events=(state.data.events||[]).slice(0,12);
 return intro('Histórico completo','Encontre pedidos de qualquer dia e confira os lançamentos anteriores.',`<button class="btn" data-action="csv-history">${icon('download')} Exportar histórico</button>`)+notice()+`<div class="panel"><div class="panel-head"><div><h3>Pedidos organizados por data</h3><p>Período: ${h(prettyMonth(state.month))}</p></div><div class="field"><label for="history-month">Selecionar mês</label><input id="history-month" type="month" class="input" value="${h(state.month)}"></div></div>${filtered.length?`<div class="table-wrap"><table class="data-table"><thead><tr><th>Data</th><th>Total de marmitas</th><th>Funcionários</th><th>Valor</th><th></th></tr></thead><tbody>${filtered.map(d=>`<tr><td><strong>${dateBR(d.date)}</strong></td><td>${qty(d.items)}</td><td>${new Set(d.items.map(o=>slugName(o.employee_name))).size}</td><td>${money(total(d.items))}</td><td><button class="btn slim" data-action="go-day" data-date="${h(d.date)}">Consultar</button></td></tr>`).join('')}</tbody></table></div>`:empty('Nenhum registro no mês','Escolha outra competência ou registre um pedido.')}</div><section class="panel" style="margin-top:20px"><div class="panel-head"><div><h3>Alterações e cancelamentos</h3><p>Rastreabilidade de inclusões, correções e cancelamentos.</p></div></div>${events.length?`<div class="table-wrap"><table class="data-table"><thead><tr><th>Quando</th><th>Operação</th><th>Funcionário</th><th>Responsável</th></tr></thead><tbody>${events.map(e=>`<tr><td>${h(new Date(e.recorded_at).toLocaleString('pt-BR'))}</td><td>${h(e.action)}</td><td>${h(e.after_data?.employee_name||e.before_data?.employee_name||'—')}</td><td>${h(e.actor_name||'—')}</td></tr>`).join('')}</tbody></table></div>`:empty('Sem alterações registradas','Novas inclusões e edições serão anotadas aqui.')}</section>`;
}
function screenValores(){
 const allowed=isAdmin(), all=sizes();
 const header=intro('Cadastro de marmitas','Adicione quantos tipos quiser: Eco, M, P, G, refeições especiais e outros. Os novos preços valem somente para próximos pedidos.',`<span class="pill ${allowed?'cloud':'readonly'}">${icon(allowed?'shield':'lock')} ${allowed?'Administrador · cadastro liberado':'Somente consulta'}</span>`);
 const rows=all.map(item=>`<form class="price-row price-row-v3" data-price-form="${h(item.id)}"><div class="field"><label>Nome da marmita</label><input class="input" name="label" value="${h(item.label)}" maxlength="90" required ${allowed?'':'disabled'}></div><div class="field"><label>Sigla usada na lista</label><input class="input" name="short_label" value="${h(item.short_label)}" maxlength="20" required ${allowed?'':'disabled'}></div><div class="field"><label>Valor unitário (R$)</label><input class="input" name="price" type="number" step="0.01" min="0" max="99999" value="${(item.price_cents/100).toFixed(2)}" required ${allowed?'':'disabled'}></div><div class="field price-status"><label>Disponível</label><select class="input" name="active" ${allowed?'':'disabled'}><option value="true" ${item.active?'selected':''}>Ativa</option><option value="false" ${!item.active?'selected':''}>Desativada</option></select></div>${allowed?`<button type="submit" class="btn primary">${icon('check')} Salvar</button>`:`<span class="pill readonly">Visualizar</span>`}</form>`).join('');
 const create=allowed?`<form id="new-size-form" class="new-size-v3"><h3 class="section-title">${icon('plus')} Cadastrar nova marmita (sem limite de tipos)</h3><div class="new-size-grid"><div class="field"><label>Nome</label><input class="input" name="label" maxlength="90" placeholder="Ex.: Marmita Grande" required></div><div class="field"><label>Sigla</label><input class="input" name="short_label" maxlength="20" placeholder="Ex.: G" required></div><div class="field"><label>Preço (R$)</label><input class="input" name="price" type="number" min="0" max="99999" step="0.01" placeholder="Ex.: 22,00" required></div><button type="submit" class="btn ink">${icon('plus')} Cadastrar marmita</button></div></form>`:'';
 return header+notice()+`<div class="stats price-stats">${stat('Tipos cadastrados',String(all.length),'plate')}${stat('Disponíveis para pedidos',String(all.filter(a=>a.active).length),'check','green')}${stat('Tipos desativados',String(all.filter(a=>!a.active).length),'tag','navy')}${stat('Preços anteriores', 'Preservados','shield','secondary')}</div><section class="panel"><div class="panel-head"><div><h3>Marmitas e valores</h3><p>Configure Econômica (Eco), Média (M), Pequena (P) ou outros tamanhos personalizados.</p></div><span class="pill ${allowed?'cloud':'readonly'}">${allowed?'Pode editar':'Somente leitura'}</span></div><div class="panel-body">${create}<div class="size-list-title">Marmitas cadastradas (${all.length})</div>${rows||empty('Nenhuma marmita cadastrada','Adicione um tipo para começar.')}</div></section><div class="helper-card" style="margin-top:20px"><strong>Valores antigos ficam preservados.</strong><p>Quando você atualizar uma marmita de R$ 12,00 para R$ 14,00, somente os próximos pedidos desse tamanho terão R$ 14,00. Os registros anteriores continuam com R$ 12,00. Para deixar de oferecer um tamanho, selecione Desativada.</p></div>`;
}
function updateCurrentPage(){const root=byId('page-content');if(!root)return;if(isOperator())state.date=dateToday();if((state.view==='usuarios'||state.view==='valores')&&!isAdmin()||(['financeiro','historico'].includes(state.view)&&!canSeeFinance())){state.view='pedidos'}root.innerHTML=({pedidos:screenPedidos,financeiro:screenFinanceiro,historico:screenHistorico,valores:screenValores,usuarios:screenUsuarios}[state.view]||screenPedidos)();}
function showModal(title,content,buttons=''){byId('modal-root').innerHTML=`<div class="modal-overlay" data-close-backdrop="1"><div class="modal" role="dialog" aria-modal="true" aria-label="${h(title)}"><div class="modal-head"><h3>${h(title)}</h3><button class="btn icon-btn" data-action="close-modal" title="Fechar">${icon('x')}</button></div><div class="modal-body">${content}</div>${buttons?`<div class="modal-actions">${buttons}</div>`:''}</div></div>`;}
function closeModal(){byId('modal-root').innerHTML=''}
function summaryForDate(date){const list=activeOrders(matchingDate(date));const sorted=[...list].sort((a,b)=>a.employee_name.localeCompare(b.employee_name,'pt-BR'));return `Marmitas ${dateBR(date)}\n\n${sorted.length?sorted.map(o=>`• ${o.qty} ${getOrderSize(o)} - ${o.employee_name}${o.notes?` (${o.notes})`:''}`).join('\n'):'Nenhuma marmita cadastrada.'}\n\nTotal: ${qty(sorted)} marmita(s)${canSeeFinance()?`\nValor total: ${money(total(sorted))}`:''}`}
async function copyText(text){try{await navigator.clipboard.writeText(text);toast('Lista copiada! Pode colar no WhatsApp.')}catch(e){showModal('Copiar lista',`<p class="dim">Selecione o texto abaixo e copie:</p><pre>${h(text)}</pre>`)}}
function bulkParse(textInput){
 const lines=String(textInput||'').split(/\r?\n/),items=[],invalid=[];
 const norm=str=>String(str||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
 const aliases=[];
 sizes().filter(s=>s.active).forEach(s=>{
   let names=[s.short_label,s.label,s.label.replace(/\s*\([^)]*\)/g,'')];
   if(s.id==='eco')names.push('eco','economico','economica');
   if(s.id==='media')names.push('media','medio','m');
   if(s.id==='p')names.push('pequena','pequeno','p');
   names.filter(Boolean).forEach(name=>aliases.push({text:String(name).trim(),normalized:norm(name),size:s}));
 });
 aliases.sort((a,b)=>b.normalized.length-a.normalized.length);
 lines.forEach((raw,idx)=>{
   let line=raw.trim().replace(/^[•*]\s*/,'').replace(/^[-–]\s+/,'').trim();
   if(!line||/^marmitas?\s/i.test(line)||/^bom dia/i.test(line)||/^total\s*:/i.test(line))return;
   let n=1;const numbered=line.match(/^(\d{1,2})\s+(.+)$/);
   if(numbered){n=Number(numbered[1]);line=numbered[2].trim();}
   const normalized=norm(line);
   const alias=aliases.find(a=>normalized.startsWith(a.normalized) && /^[\s–:-]/.test(normalized.slice(a.normalized.length)));
   if(!alias){invalid.push(`Linha ${idx+1}: ${raw.trim()}`);return}
   const employee_name=normalizeName(line.slice(alias.text.length).replace(/^[\s–:-]+/,'').trim());
   if(!employee_name||n<1||n>99){invalid.push(`Linha ${idx+1}: ${raw.trim()}`);return}
   const s=alias.size;
   items.push({employee_name,size_id:s.id,size_label:s.label,size_short_label:s.short_label,unit_price_cents:s.price_cents,qty:n});
 });
 return {items,invalid};
}
function popupBulk(){
 showModal('Importar lista de marmitas',`<p class="dim">Cole uma lista no mesmo formato que você envia no WhatsApp. A data de todos os pedidos será <strong>${dateBR(state.date)}</strong>.</p><form id="bulk-form"><div class="field"><label>Lista de pedidos</label><textarea class="input" name="content" rows="9" style="min-height:190px" placeholder="1 Eco - Nicole\n1 M - Guilherme\n1 P - Giovani\nEco - Cristiano" required></textarea></div><p class="footnote">Aceita qualquer sigla cadastrada e ativa (Eco, M, P, G etc.), com quantidade opcional (padrão 1). Não importa linhas desconhecidas sem avisar.</p><button class="btn primary" style="width:100%" type="submit">${icon('plus')} Conferir e cadastrar lista</button></form>`)
}
async function importBulk(form){
 todayForOperator();
 if(!canWrite())throw Error('O financeiro não pode registrar pedidos.');
 const {items,invalid}=bulkParse(form.elements.content.value);
 if(invalid.length)throw Error('Corrija estas linhas antes de importar: '+invalid.slice(0,3).join(' | '));
 if(!items.length)throw Error('Nenhum pedido válido encontrado. Confira os tamanhos.');
 const repeats=items.filter(x=>activeOrders(matchingDate(state.date)).some(o=>slugName(o.employee_name)===slugName(x.employee_name)&&o.size_id===x.size_id));
 if(repeats.length&&!confirm(`${repeats.length} item(ns) já possui(em) pedido desse tamanho na data. Importar mesmo assim?`))return;
 if(!confirm(`Importar ${items.length} linha(s) e ${qty(items)} marmita(s) para ${dateBR(state.date)}?`))return;
 const actor=state.mode==='cloud'?(await state.sb.auth.getUser()).data.user.id:null;
 const records=items.map(x=>({order_date:state.date,employee_name:x.employee_name,size_id:x.size_id,qty:x.qty,notes:'',status:'active',created_by_name:userName(),...(state.mode==='cloud'?{created_by:actor}:{id:id(),size_label:x.size_label,size_short_label:x.size_short_label,unit_price_cents:x.unit_price_cents,created_at:new Date().toISOString()})}));
 if(state.mode==='cloud'){
   const {error}=await state.sb.from('orders').insert(records);if(error)throw error;await cloudLoad();
 }else{state.data.orders.unshift(...records);records.forEach(r=>emitLocalEvent('Criado',null,r));saveLocal()}
 closeModal();dispatchRender();toast(`${qty(records)} marmita(s) importada(s) com sucesso.`)
}
function popupEdit(o){
 const ss=sizes().filter(s=>s.active||s.id===o.size_id);
 showModal(`Editar pedido de ${o.employee_name}`,`<form id="edit-order-form" data-id="${h(o.id)}"><div class="field"><label>Nome do funcionário</label><input class="input" name="employee" value="${h(o.employee_name)}" required maxlength="100"></div><div class="field"><label>Tamanho</label><select class="input" name="size" required>${ss.map(s=>`<option value="${h(s.id)}" ${s.id===o.size_id?'selected':''}>${h(s.label)} — ${money(s.price_cents)}</option>`).join('')}</select></div><div class="field"><label>Quantidade</label><input class="input" type="number" name="qty" min="1" max="99" value="${Number(o.qty)}" required></div><div class="field"><label>Observações</label><textarea class="input" name="notes" maxlength="500">${h(o.notes||'')}</textarea></div><p class="dim">Ao alterar o tamanho, será aplicado o preço cadastrado atualmente. Mudanças são registradas no histórico.</p><button class="btn primary" style="width:100%" type="submit">${icon('check')} Salvar alterações</button></form>`)
}
function popupCancel(o){showModal('Cancelar lançamento',`<p>Cancelar a marmita de <strong>${h(o.employee_name)}</strong>, do dia <strong>${dateBR(o.order_date)}</strong>?</p><p class="dim">O pedido deixará de contar para o total, mas continuará visível no histórico de alterações.</p>`,`<button class="btn" data-action="close-modal">Voltar</button><button class="btn danger" data-action="confirm-cancel" data-id="${h(o.id)}">${icon('x')} Confirmar cancelamento</button>`)}
function popupDetails(name){const g=monthlyGroup().find(g=>slugName(g.name)===slugName(name));if(!g)return;const list=[...g.orders].sort((a,b)=>a.order_date.localeCompare(b.order_date));showModal(`Extrato de ${g.name}`,`<p class="dim">${h(prettyMonth(state.month))} • ${g.qty} marmitas • ${money(g.total)}</p><div class="detail-list">${list.map(o=>`<div class="detail-row"><span>${dateBR(o.order_date)}</span><strong>${h(getOrderSize(o))}</strong><span>${h(o.qty)} un.</span><strong>${money(o.qty*o.unit_price_cents)}</strong></div>`).join('')}<div class="detail-row total-row"><span>Total</span><strong></strong><span>${g.qty} un.</span><strong>${money(g.total)}</strong></div></div>`,`<button class="btn" data-action="close-modal">Fechar</button>`)}
function popupConnection(){
 if(state.mode==='cloud')return showModal('Conta conectada',`<p>Projeto online ativo. Login: <strong>${h(state.profile?.display_name||'Usuário')}</strong> (${h(roleName())}).</p><p class="dim">Os pedidos são compartilhados com as pessoas autorizadas no mesmo projeto Supabase. O financeiro tem acesso somente de leitura.</p>`,`<button class="btn" data-action="close-modal">Fechar</button><button class="btn danger" data-action="logout">${icon('logout')} Sair</button>`);
 const config=state.cloudConfig||{};
 showModal('Conectar banco de dados',`<p class="dim">Cole a URL e a chave publicável (anon/publishable) do Supabase depois de executar o arquivo <strong>supabase.sql</strong>. É seguro publicar a chave publicável quando as políticas RLS estiverem ativas. Nunca use service_role.</p><form id="connect-form"><div class="field"><label>URL do projeto</label><input class="input" type="url" name="url" placeholder="https://seu-projeto.supabase.co" value="${h(config.url||'')}" required></div><div class="field"><label>Chave publicável / anon</label><input class="input" name="key" placeholder="sb_publishable_... ou eyJ..." value="${h(config.key||'')}" required autocomplete="off"></div><button type="submit" class="btn primary" style="width:100%">${icon('cloud')} Salvar e conectar</button></form><p class="footnote">Os logins devem ser criados em Authentication → Users no Supabase. A prévia local não sincroniza pedidos com a nuvem.</p>`)
}
function popupAccount(){
 showModal('Minha conta',`<div class="account-person"><strong>${h(userName())}</strong><span>${h(roleName())} · ${state.mode==='cloud'?'Supabase (acesso online)':'Prévia local sem login'}</span></div><p class="dim">Cada pessoa altera a sua própria senha dentro do aplicativo. Os novos logins são criados pelo administrador em Usuários e acessos.</p>`,`<button class="btn" data-action="password-self" ${state.mode==='cloud'?'':'disabled'}>${icon('key')} Alterar minha senha</button>${isAdmin()?`<button class="btn" data-action="nav-users">${icon('users')} Ver usuários</button>`:''}<button class="btn danger" data-action="logout">${icon('logout')} Sair</button>`)
}
function popupSelfPassword(){
 if(state.mode!=='cloud')throw Error('Para trocar a senha, faça login com sua conta Supabase.');
 showModal('Alterar minha senha',`<form id="self-password-form" class="auth-fields"><div class="field"><label>Senha atual</label><input class="input" type="password" name="current" minlength="8" autocomplete="current-password" required></div><div class="field"><label>Nova senha (mínimo 8 caracteres)</label><input class="input" type="password" name="password" minlength="8" autocomplete="new-password" required></div><div class="field"><label>Confirmar nova senha</label><input class="input" type="password" name="confirm" minlength="8" autocomplete="new-password" required></div><button type="submit" class="btn primary">${icon('check')} Salvar nova senha</button></form>`)
}
function renderLocalEntry(){
 state.mode='local';state.profile=null;state.localUser=null;state.users=[];
 byId('app').innerHTML=`<div class="auth-screen"><section class="auth-card"><div class="auth-hero"><img class="auth-logo" src="./nexa-marmitas-logo.webp" alt="Nexa Marmitas"><h1>Conectar Nexa Marmitas</h1><p>Os logins são criados no Supabase. Informe os dados do projeto para entrar com seu e-mail e senha.</p></div><div class="auth-fields"><button type="button" class="btn primary" data-action="connect">${icon('cloud')} Configurar Supabase</button>${!deployConfig?.url?`<button type="button" class="btn" data-action="preview-demo">${icon('plate')} Ver prévia sem login</button>`:''}<p class="dim">A prévia funciona somente neste navegador. Para compartilhar os pedidos com o financeiro, configure o banco online e publique em HTTPS.</p></div></section></div>`;
}
function startPreview(){
 state.mode='local';state.localUser={id:'demo-admin',role:'admin',display_name:'Administrador (prévia)'};state.profile=null;state.data=getLocal();state.view='pedidos';dispatchRender();
}
function screenUsuarios(){
 if(!isAdmin())return empty('Acesso restrito','Somente o administrador pode gerenciar acessos.');
 const users=state.users||[];
 const roles=[['operador','Funcionário · somente pedidos do dia'],['financeiro','Financeiro · consulta de valores e pedidos'],['admin','Administrador · acesso completo']];
 const opts=(selected)=>roles.map(([v,label])=>`<option value="${v}" ${selected===v?'selected':''}>${h(label)}</option>`).join('');
 const create=state.mode==='cloud'?`<form id="create-user-form" class="admin-form"><div class="field"><label>Nome completo</label><input class="input" name="name" minlength="2" maxlength="100" placeholder="Nome do funcionário" required></div><div class="field"><label>E-mail de acesso</label><input class="input" type="email" name="email" autocomplete="off" placeholder="nome@empresa.com.br" required></div><div class="field"><label>Senha inicial (mínimo 8 caracteres)</label><input class="input" type="password" name="password" minlength="8" maxlength="128" autocomplete="new-password" required></div><div class="field"><label>Perfil do usuário</label><select class="input" name="role">${opts('operador')}</select></div><p class="footnote">A senha inicial é definida pelo administrador. O usuário poderá alterá-la em Minha conta. Compartilhe a senha de modo privado.</p><button class="btn primary" type="submit">${icon('plus')} Criar acesso</button></form>`:`<div class="alert">Entre no Supabase para cadastrar usuários de verdade. A prévia local não cria logins.</div>`;
 const list=users.map(u=>`<div class="user-directory-item"><div class="user-avatar">${h((u.display_name||'?').slice(0,1).toUpperCase())}</div><div class="user-directory-meta"><strong>${h(u.display_name||'Sem nome')}</strong><small>${h(u.email||'—')}</small><span>${h(roleLabel(u.role))}</span></div><div class="user-role-edit"><select class="input" data-role-target="${h(u.id)}" aria-label="Permissão de ${h(u.display_name)}" ${state.profile?.id===u.id?'disabled':''}>${opts(u.role)}</select><button class="btn slim" data-action="update-user-role" data-id="${h(u.id)}" ${state.profile?.id===u.id?'disabled title="Você não pode alterar o próprio perfil"':''}>Salvar</button></div></div>`).join('');
 return intro('Usuários e acessos','O administrador cria os logins e escolhe o que cada pessoa pode fazer.',`<button class="btn" data-action="reload-users">${icon('refresh')} Atualizar</button>`)+notice()+`<div class="two-col admin-users-layout"><section class="panel"><div class="panel-head"><div><h3>${icon('plus')} Criar novo acesso</h3><p>Funcionário, financeiro ou administrador.</p></div></div><div class="panel-body">${create}</div></section><section class="panel"><div class="panel-head"><div><h3>Contas cadastradas</h3><p>${users.length} usuário(s) autorizados no Supabase.</p></div></div>${users.length?`<div class="user-directory">${list}</div>`:empty('Nenhuma conta na lista','Atualize após criar um acesso.')}<div class="admin-access-hint">${icon('shield')}<p><strong>Segurança:</strong> a criação de contas usa a função protegida <code>marmitas-admin</code> no Supabase. Para funcionar, publique a função incluída no ZIP. Nunca coloque uma chave secreta no navegador.</p></div></section></div>`;
}
async function adminCall(body){
 if(!isAdmin()||state.mode!=='cloud')throw Error('Apenas o administrador conectado ao Supabase pode gerenciar contas.');
 const {data,error}=await state.sb.functions.invoke('marmitas-admin',{body});
 if(error){let message=error.message||'Não foi possível acessar a função de usuários.';try{if(error.context){const details=await error.context.json();message=details.error||details.message||message;}}catch(_){}throw Error(message+(message.includes('Failed to send')?' Verifique a publicação da Edge Function.':''))}
 if(data?.error)throw Error(data.error);
 return data;
}
async function createUser(form){
 const name=normalizeName(form.elements.name.value),email=form.elements.email.value.trim().toLowerCase(),password=form.elements.password.value,role=form.elements.role.value;
 if(name.length<2||name.length>100||!/^\S+@\S+\.\S+$/.test(email)||password.length<8||!['admin','operador','financeiro'].includes(role))throw Error('Confira nome, e-mail, senha e perfil.');
 await adminCall({action:'create',name,email,password,role});
 form.reset();await loadAdminUsers();dispatchRender();toast(`Acesso de ${name} criado com perfil ${roleLabel(role)}.`);
}
async function updateUserRole(userId){
 const target=state.users.find(u=>u.id===userId);if(!target)throw Error('Usuário não encontrado.');
 const choice=document.querySelector(`[data-role-target="${userId}"]`),role=choice?.value;
 if(!['admin','operador','financeiro'].includes(role))throw Error('Perfil inválido.');
 if(target.role===role){toast('A permissão já está atualizada.');return}
 if(!confirm(`Alterar ${target.display_name} de ${roleLabel(target.role)} para ${roleLabel(role)}?`))return;
 await adminCall({action:'set-role',user_id:userId,role});
 await loadAdminUsers();dispatchRender();toast('Permissão atualizada. O usuário deverá atualizar a sessão para ver o novo acesso.');
}
async function loadAdminUsers(){
 if(!isAdmin())return;
 if(state.mode!=='cloud'){state.users=[];return}
 const {data,error}=await state.sb.from('app_users').select('id,display_name,email,role,created_at').order('created_at',{ascending:true});
 if(error)throw error;
 state.users=data||[];
}
async function changeOwnPassword(form){
 if(state.mode!=='cloud'||!state.sb)throw Error('Entre na sua conta online primeiro.');
 const oldPassword=form.elements.current.value, newPassword=form.elements.password.value;
 if(newPassword.length<8||newPassword!==form.elements.confirm.value)throw Error('A nova senha precisa ter no mínimo 8 caracteres e ser igual à confirmação.');
 if(oldPassword===newPassword)throw Error('A nova senha deve ser diferente da atual.');
 const {data:me,error:meError}=await state.sb.auth.getUser();if(meError||!me.user?.email)throw Error('Sessão expirada. Entre novamente.');const {error:verifyError}=await state.sb.auth.signInWithPassword({email:me.user.email,password:oldPassword});if(verifyError)throw Error('A senha atual não confere.');const {error}=await state.sb.auth.updateUser({password:newPassword});
 if(error)throw new Error(error.message);
 closeModal();toast('Senha atualizada no Supabase. Use a nova senha no próximo acesso.');
}
function downloadCSV(filename,rows){const csv='\ufeff'+rows.map(row=>row.map(c=>`"${String(c??'').replace(/"/g,'""')}"`).join(';')).join('\r\n');const blob=new Blob([csv],{type:'text/csv;charset=utf-8'});const url=URL.createObjectURL(blob),anchor=document.createElement('a');anchor.href=url;anchor.download=filename;document.body.append(anchor);anchor.click();anchor.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('Relatório CSV exportado.')}
const orderHeaders=['Data','Funcionário','Quantidade','Tamanho','Valor unitário (R$)','Valor total (R$)','Observações','Responsável','Status'];
const recordCSV=(o)=>[dateBR(o.order_date),o.employee_name,o.qty,getOrderSize(o),(o.unit_price_cents/100).toFixed(2).replace('.',','),(o.qty*o.unit_price_cents/100).toFixed(2).replace('.',','),o.notes||'',o.created_by_name||'',o.status==='cancelled'?'Cancelado':'Ativo'];
function exportDay(){downloadCSV(`marmitas_${state.date}.csv`,[orderHeaders,...matchingDate(state.date).map(recordCSV)])}
function exportHistory(){downloadCSV(`marmitas_historico_${state.month}.csv`,[orderHeaders,...matchingMonth(state.month).map(recordCSV)])}
// CSV com visão diária completa, totais por funcionário e pedidos detalhados.
function exportMonth(){
 const daily=monthlyDaily(),groups=monthlyGroup(),list=activeOrders(matchingMonth(state.month));
 const csvMoney=(cents)=>(cents/100).toFixed(2).replace('.',',');
 downloadCSV(`nexa_marmitas_fechamento_${state.month}.csv`,[
   ['NEXA MARMITAS — FECHAMENTO MENSAL'],
   ['Empresa / setor',reportCompanyName()||'Não informado'],
   ['Competência',prettyMonth(state.month)],
   ['Total de marmitas',qty(list)],
   ['Gasto total do mês (R$)',csvMoney(total(list))],
   [],['GASTOS POR DIA — TODOS OS DIAS DO MÊS'],
   ['Data','Dia da semana','Marmitas','Funcionários','Valor (R$)','Situação'],
   ...daily.map(d=>[dateBR(d.date),d.weekday,d.quantity,d.employees,csvMoney(d.amount),d.hasOrders?'Com lançamento':'Sem lançamento']),
   ['TOTAL MENSAL','',qty(list),'',csvMoney(total(list))],
   [],['TOTAL POR FUNCIONÁRIO'],
   ['Funcionário','Dias com pedido','Marmitas','Valor total (R$)'],
   ...groups.map(g=>[g.name,g.days.size,g.qty,csvMoney(g.total)]),
   [],['DETALHAMENTO DOS PEDIDOS ATIVOS'],
   orderHeaders,...list.sort((a,b)=>a.order_date.localeCompare(b.order_date)||a.employee_name.localeCompare(b.employee_name,'pt-BR')).map(recordCSV)
 ]);
}
function monthlyShareText(){
 const daily=monthlyDaily(),list=activeOrders(matchingMonth(state.month));
 return `FECHAMENTO DE MARMITAS — ${prettyMonth(state.month).toUpperCase()}\n${reportCompanyName()?`Empresa / setor: ${reportCompanyName()}\n`:''}Total do mês: ${money(total(list))}\nMarmitas: ${qty(list)}\n\nGASTO POR DATA\n${daily.map(d=>`${dateBR(d.date)} — ${d.quantity} marmita(s) — ${money(d.amount)}${d.hasOrders?'':' (sem lançamento)'}`).join('\n')}\n\nValores referentes aos pedidos registrados no Nexa Marmitas.`;
}
async function shareMonth(){
 const text=monthlyShareText();
 if(navigator.share){try{await navigator.share({title:`Fechamento de marmitas ${state.month}`,text});return}catch(e){if(e?.name==='AbortError')return}}
 await copyText(text);
 toast('Resumo mensal copiado. Cole no WhatsApp ou no e-mail da empresa.');
}
function printFinance(){
 const daily=monthlyDaily(),groups=monthlyGroup(),list=activeOrders(matchingMonth(state.month));
 const company=reportCompanyName();
 const details=[...list].sort((a,b)=>a.order_date.localeCompare(b.order_date)||a.employee_name.localeCompare(b.employee_name,'pt-BR'));
 const html=`<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Nexa Marmitas - Fechamento ${h(state.month)}</title><style>
 @page{size:A4;margin:15mm 13mm}
 *{box-sizing:border-box}body{font-family:Arial,Helvetica,sans-serif;color:#172032;margin:0;font-size:10pt}header{border-bottom:3px solid #f6b91b;padding-bottom:13px;display:flex;justify-content:space-between;gap:15px;align-items:start}header h1{font-size:20pt;margin:0 0 5px}header p{color:#58657a;margin:3px 0}.brand{font-size:10pt;letter-spacing:1.3px;font-weight:bold;color:#a87600;text-align:right}h2{font-size:12pt;margin:25px 0 9px;border-left:4px solid #f6b91b;padding-left:9px}.summary{display:flex;gap:10px;margin-top:19px}.sum-item{border:1px solid #e5e8ef;border-radius:7px;padding:13px;flex:1}.sum-item strong{display:block;font-size:15pt;margin-top:7px}.sum-item span{font-size:8pt;color:#6e7a8e}.sum-item.total{background:#fff5d9;border-color:#f5da92}.sum-item.total strong{font-size:18pt}table{width:100%;border-collapse:collapse;table-layout:fixed;font-size:8pt}thead{display:table-header-group}th,td{text-align:left;padding:4px 8px;border-bottom:1px solid #e4e7ec;overflow-wrap:anywhere}th{background:#f1f3f7;color:#364257;font-weight:bold}tbody tr{break-inside:avoid;page-break-inside:avoid}tbody tr:nth-child(even){background:#fbfbfd}td.num,th.num{text-align:right}td.zero{color:#9da5b0}.total-row td{background:#fff2cd;font-weight:bold;padding:10px 8px}.note{font-size:8pt;color:#758095;margin-top:14px;line-height:1.5}.section{break-inside:auto}@media print{.section-people{break-before:page;page-break-before:always}}.footer{font-size:8pt;color:#6a7588;border-top:1px solid #e3e8f0;padding-top:10px;margin-top:23px}body{print-color-adjust:exact;-webkit-print-color-adjust:exact}@media screen{body{max-width:850px;padding:30px;margin:auto;background:white;box-shadow:0 0 0 100vw #e8ebf1}}
 </style></head><body>
 <header><div><h1>Fechamento mensal de marmitas</h1><p><strong>Competência:</strong> ${h(prettyMonth(state.month))}</p>${company?`<p><strong>Empresa / setor:</strong> ${h(company)}</p>`:''}<p><strong>Emissão:</strong> ${h(new Date().toLocaleString('pt-BR'))}</p></div><div class="brand">NEXA<br>MARMITAS</div></header>
 <div class="summary"><div class="sum-item"><span>GASTO REGISTRADO NO MÊS</span><strong>${money(total(list))}</strong></div><div class="sum-item"><span>TOTAL DE MARMITAS</span><strong>${qty(list)}</strong></div><div class="sum-item total"><span>DIAS COM LANÇAMENTO</span><strong>${daily.filter(d=>d.hasOrders).length} / ${daily.length}</strong></div></div>
 <section class="section"><h2>1. Gastos por dia — mês completo</h2><table><thead><tr><th>Data</th><th>Dia</th><th class="num">Marmitas</th><th class="num">Funcionários</th><th class="num">Valor</th><th>Situação</th></tr></thead><tbody>
 ${daily.map(d=>`<tr><td>${dateBR(d.date)}</td><td>${h(d.weekday)}</td><td class="num">${d.quantity}</td><td class="num">${d.employees}</td><td class="num ${d.hasOrders?'':'zero'}">${money(d.amount)}</td><td class="${d.hasOrders?'':'zero'}">${d.hasOrders?'Lançado':'Sem lançamento'}</td></tr>`).join('')}
 <tr class="total-row"><td colspan="2">TOTAL DO MÊS</td><td class="num">${qty(list)}</td><td></td><td class="num">${money(total(list))}</td><td></td></tr></tbody></table></section>
 <section class="section section-people"><h2>2. Resumo por funcionário</h2><table><thead><tr><th>Funcionário</th><th class="num">Dias com pedido</th><th class="num">Marmitas</th><th class="num">Valor total</th></tr></thead><tbody>${groups.length?groups.map(g=>`<tr><td>${h(g.name)}</td><td class="num">${g.days.size}</td><td class="num">${g.qty}</td><td class="num">${money(g.total)}</td></tr>`).join(''):'<tr><td colspan="4">Nenhum pedido registrado no mês.</td></tr>'}</tbody></table></section>
 <section class="section"><h2>3. Detalhamento dos pedidos</h2><table><thead><tr><th>Data</th><th>Funcionário</th><th>Tamanho</th><th class="num">Qtd.</th><th class="num">Unitário</th><th class="num">Total</th></tr></thead><tbody>${details.length?details.map(o=>`<tr><td>${dateBR(o.order_date)}</td><td>${h(o.employee_name)}</td><td>${h(getOrderSize(o))}</td><td class="num">${o.qty}</td><td class="num">${money(o.unit_price_cents)}</td><td class="num">${money(o.qty*o.unit_price_cents)}</td></tr>`).join(''):'<tr><td colspan="6">Sem pedidos para detalhar.</td></tr>'}</tbody></table></section>
 <p class="note">Relatório de pedidos ativos cadastrados no Nexa Marmitas. Datas sem lançamento não comprovam ausência de consumo. Valores representam gastos registrados com marmitas, sem aplicação de descontos ou subsídios.</p><div class="footer">Nexa Marmitas • Fechamento ${h(state.month)} • Documento gerado pelo sistema para conferência da empresa.</div>
 </body></html>`;
 const win=window.open('','_blank');
 if(!win){toast('O navegador bloqueou o relatório. Permita pop-ups e tente novamente.');return}
 win.document.open();win.document.write(html);win.document.close();win.focus();
 setTimeout(()=>{try{win.print()}catch(e){console.warn('Não foi possível abrir a impressão:',e)}},400);
 toast('Escolha "Salvar como PDF" na janela de impressão para enviar à empresa.');
}
async function cloudLoad(){
 if(!state.sb)return;
 const {data:authData,error:authError}=await state.sb.auth.getUser();
 if(authError||!authData?.user?.id)throw Error('Faça login novamente para acessar os pedidos.');
 const {data:profile,error:profileError}=await state.sb.from('app_users').select('*').eq('id',authData.user.id).maybeSingle();
 if(profileError)throw profileError;
 if(!profile){state.profile=null;throw Error('Este login ainda não está autorizado em app_users.');}
 state.profile=profile;
 if(profile.role==='operador'){
   const [sizeResult,dayResult]=await Promise.all([state.sb.rpc('list_operator_sizes'),state.sb.rpc('list_operator_day')]);
   if(sizeResult.error)throw sizeResult.error;
   if(dayResult.error)throw dayResult.error;
   state.data={sizes:(sizeResult.data||[]).map(s=>({...s,price_cents:0})),orders:(dayResult.data||[]).map(o=>({...o,unit_price_cents:0})),events:[]};
   state.date=dateToday();return;
 }
 const sizeResult=await state.sb.from('sizes').select('*').order('sort_order');
 if(sizeResult.error)throw sizeResult.error;
 const result=[];const page=800;
 for(let start=0;start<20000;start+=page){const {data,error}=await state.sb.from('orders').select('*').order('order_date',{ascending:false}).range(start,start+page-1);if(error)throw error;result.push(...(data||[]));if(!data||data.length<page)break}
 const events=[];const {data:eventRows,error:eventError}=await state.sb.from('order_events').select('*').order('recorded_at',{ascending:false}).limit(50);if(!eventError)events.push(...(eventRows||[]));
 state.data={sizes:sizeResult.data||[],orders:result,events};
}
function startRealtime(){
  if(!state.sb || realtimeChannel)return;
  realtimeChannel=state.sb.channel('marmitas-realtime')
    .on('postgres_changes',{event:'*',schema:'public',table:'orders'},receiveRealtime)
    .on('postgres_changes',{event:'*',schema:'public',table:'sizes'},receiveRealtime)
    .subscribe();
}
async function receiveRealtime(){
  try{
    await cloudLoad();
    const focused=document.activeElement;
    if(focused && focused.matches('input,textarea,select'))toast('Novos dados recebidos. Clique em Atualizar para atualizar a tela.');
    else if(state.mode==='cloud')dispatchRender();
  }catch(err){console.warn('Sincronização:',err)}
}
function stopRealtime(){if(realtimeChannel&&state.sb){state.sb.removeChannel(realtimeChannel);realtimeChannel=null}}
async function connectCloud(){
 const config=state.cloudConfig;
 if(!config?.url || !config?.key)return false;
 try{
   const sdk=await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
   state.sb=sdk.createClient(config.url,config.key,{auth:{persistSession:true,autoRefreshToken:true}});
   const {data,error}=await state.sb.auth.getSession();if(error)throw error;
   state.mode='cloud';state.cloudError='';
   if(data.session){await cloudLoad();dispatchRender();startRealtime()}else{renderLogin()}
   return true;
 }catch(err){state.cloudError=errorMessage(err);renderCloudFailure(state.cloudError);return false}
}
function renderCloudFailure(message){
 byId('app').innerHTML=`<div class="auth-screen"><section class="auth-card"><div class="auth-hero"><img class="auth-logo" src="./nexa-marmitas-logo.webp" alt="Nexa Marmitas"><h1>Não foi possível conectar</h1><p>Confira sua conexão com a internet e tente novamente. O sistema precisa acessar o Supabase.</p></div><div class="auth-fields"><div class="alert">${h(message)}</div><button type="button" class="btn primary" data-action="retry-cloud">${icon('refresh')} Tentar novamente</button><p class="dim">Nenhum pedido local será enviado automaticamente para o banco online.</p></div></section></div>`;
}
function renderLogin(message=''){byId('app').innerHTML=`<div class="auth-screen"><section class="auth-card"><div class="auth-hero"><img class="auth-logo" src="./nexa-marmitas-logo.webp" alt="Nexa Marmitas"><h1>Entrar no Nexa Marmitas</h1><p>Entre com o e-mail e a senha cadastrados pelo administrador no Supabase.</p></div><form id="login-form" class="auth-fields"><div class="field"><label for="login-email">E-mail</label><input class="input" type="email" name="email" id="login-email" autocomplete="username" required placeholder="nome@empresa.com.br"></div><div class="field"><label for="login-password">Senha</label><input class="input" type="password" name="password" id="login-password" autocomplete="current-password" required placeholder="Sua senha"></div>${message||state.cloudError?`<div class="alert">${h(message||state.cloudError)}</div>`:''}<button class="btn primary" type="submit">${icon('lock')} Entrar no painel</button></form><div class="auth-footer">Acesso restrito aos usuários cadastrados no Supabase.${!deployConfig?.url?`<br><button class="text-link" data-action="reset-config">Trocar projeto Supabase</button>`:''}</div></section></div>`}
async function login(email,password){const {error}=await state.sb.auth.signInWithPassword({email,password});if(error)throw error;await cloudLoad();dispatchRender();startRealtime()}
async function logout(){stopRealtime();closeModal();if(state.mode==='cloud'){if(state.sb)await state.sb.auth.signOut();state.profile=null;renderLogin();return}state.localUser=null;renderLocalEntry()}
async function mutateOrder(action,payload,idToUpdate){
 if(!canWrite()||(action!=='create'&&!canEditOrders()))throw Error('Sem permissão para esta operação.');
 if(state.mode==='cloud'){
   const query=action==='create'?state.sb.from('orders').insert(payload):state.sb.from('orders').update(payload).eq('id',idToUpdate);
   const {error}=await query;if(error)throw error;await cloudLoad();
 }else{
   if(action==='create'){state.data.orders.unshift(payload);emitLocalEvent('Criado',null,payload)}
   else{const before=state.data.orders.find(o=>o.id===idToUpdate);if(!before)throw Error('Pedido não encontrado');const previous={...before};Object.assign(before,payload,{updated_at:new Date().toISOString()});emitLocalEvent(payload.status==='cancelled'?'Cancelado':'Editado',previous,before)}
   saveLocal();
 }
 dispatchRender();
}
async function saveOrder(form){todayForOperator();const name=normalizeName(byId('employee')?.value);const size=sizes().find(s=>s.id===byId('order-size')?.value && s.active);const q=Number(byId('quantity')?.value);const note=byId('notes')?.value.trim()||'';
 if(!name||name.length>100)throw Error('Informe o nome do funcionário.');if(!size)throw Error('Selecione um tamanho ativo.');if(!Number.isInteger(q)||q<1||q>99)throw Error('Informe uma quantidade entre 1 e 99.');
 const dup=activeOrders(matchingDate(state.date)).find(o=>slugName(o.employee_name)===slugName(name)&&o.size_id===size.id);
 if(dup && !window.confirm(`${dup.employee_name} já possui pedido de ${sizeShort(size)} em ${dateBR(state.date)}. Deseja cadastrar mais ${q}?`))return;
 const prior=orders().find(o=>slugName(o.employee_name)===slugName(name));const finalName=prior?.employee_name||name;
 const payload={order_date:state.date,employee_name:finalName,size_id:size.id,qty:q,notes:note,status:'active',created_by_name:userName()};
 if(state.mode==='cloud'){payload.created_by=(await state.sb.auth.getUser()).data.user.id}
 else Object.assign(payload,{id:id(),size_label:size.label,size_short_label:size.short_label,unit_price_cents:size.price_cents,created_at:new Date().toISOString()});
 await mutateOrder('create',payload);toast(`${q} marmita(s) de ${finalName} registrada(s) em ${dateBR(state.date)}.`);
}
async function saveEdit(form){const order=orders().find(o=>o.id===form.dataset.id);if(!order)throw Error('Pedido não localizado');const name=normalizeName(form.elements.employee.value);const size=sizes().find(s=>s.id===form.elements.size.value);const q=Number(form.elements.qty.value);if(!name||name.length>100||!size||!Number.isInteger(q)||q<1||q>99)throw Error('Confira nome, tamanho e quantidade.');
 const payload={employee_name:name,size_id:size.id,qty:q,notes:form.elements.notes.value.trim()};if(state.mode==='local'){Object.assign(payload,{size_label:size.label,size_short_label:size.short_label,unit_price_cents:size.id===order.size_id?order.unit_price_cents:size.price_cents})}
 await mutateOrder('update',payload,order.id);closeModal();toast('Pedido corrigido. O histórico de alterações foi atualizado.');
}
async function cancelOrder(order){if(!order||!canEditOrders())return;const payload={status:'cancelled'};if(state.mode==='local')Object.assign(payload,{cancelled_at:new Date().toISOString()});await mutateOrder('update',payload,order.id);closeModal();toast('Pedido cancelado e removido dos totais.');}
function priceFromForm(form){
 const label=normalizeName(form.elements.label.value),short_label=normalizeName(form.elements.short_label.value),number=Number(form.elements.price.value);
 if(!label||label.length>90||!short_label||short_label.length>20||!Number.isFinite(number)||number<0||number>99999)throw Error('Preencha nome, sigla e valor válidos.');
 const price_cents=Math.round(number*100);
 return {label,short_label,price_cents};
}
function checkDuplicateSize(short_label,currentId){
 if(sizes().some(o=>o.id!==currentId&&slugName(o.short_label)===slugName(short_label)))throw Error('Já existe uma marmita com esta sigla. Use uma sigla diferente.');
}
async function savePrice(form){
 if(!isAdmin())throw Error('Somente o administrador pode alterar marmitas e preços.');
 const old=sizes().find(x=>x.id===form.dataset.priceForm);if(!old)throw Error('Marmita não encontrada.');
 const info=priceFromForm(form);checkDuplicateSize(info.short_label,old.id);
 const payload={...info,active:form.elements.active.value==='true'};
 if(info.price_cents!==Number(old.price_cents) && !confirm(`Alterar ${old.label} de ${money(old.price_cents)} para ${money(info.price_cents)}? Os pedidos antigos manterão seu valor original.`))return;
 if(state.mode==='cloud'){const {error}=await state.sb.from('sizes').update(payload).eq('id',old.id);if(error)throw error;await cloudLoad()}
 else{Object.assign(old,payload);saveLocal()}
 dispatchRender();toast('Marmita atualizada. O novo valor vale para os próximos pedidos.');
}
async function newPrice(form){
 if(!isAdmin())throw Error('Somente administradores podem cadastrar marmitas.');
 const info=priceFromForm(form);checkDuplicateSize(info.short_label,null);
 if(sizes().some(s=>slugName(s.label)===slugName(info.label)))throw Error('Já existe uma marmita com este nome.');
 const payload={id:'tam_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,6),...info,active:true,sort_order:sizes().length};
 if(state.mode==='cloud'){const {error}=await state.sb.from('sizes').insert(payload);if(error)throw error;await cloudLoad()}
 else{state.data.sizes.push(payload);saveLocal()}
 dispatchRender();toast(`Marmita ${info.short_label} cadastrada por ${money(info.price_cents)}.`);
}
async function refreshCloud(){if(state.mode==='cloud'){await cloudLoad();dispatchRender();toast('Pedidos sincronizados.')}else toast('Dados locais atualizados.');}
async function handleAction(btn){const action=btn.dataset.action;
 switch(action){
 case 'nav':state.view=btn.dataset.view;state.query='';if(state.view==='usuarios'&&isAdmin())await loadAdminUsers();dispatchRender();break;
 case 'account':popupAccount();break;
 case 'nav-users':if(!isAdmin())throw Error('Somente administradores.');closeModal();state.view='usuarios';await loadAdminUsers();dispatchRender();break;
 case 'password-self':popupSelfPassword();break;
 case 'reload-users':await loadAdminUsers();dispatchRender();toast('Lista de usuários atualizada.');break;
 case 'update-user-role':await updateUserRole(btn.dataset.id);break;
  case 'connect':popupConnection();break;
 case 'retry-cloud':await connectCloud();break;
 case 'preview-demo':startPreview();break;
 case 'close-modal':closeModal();break;
 case 'refresh':await refreshCloud();break;
 case 'go-day':if(isOperator())throw Error('Funcionários acessam apenas pedidos de hoje.');state.date=btn.dataset.date;state.view='pedidos';dispatchRender();break;
 case 'copy-day':await copyText(summaryForDate(state.date));break;
 case 'copy-supplier-month':if(!canSeeFinance())throw Error('Sem permissão para consultar os valores.');await copyText(supplierMonthText());break;
 case 'paste-list':popupBulk();break;
 case 'csv-day':if(isOperator())throw Error('Exportação reservada à administração.');exportDay();break;
 case 'csv-month':if(!canSeeFinance())throw Error('Somente financeiro e administrador podem exportar valores.');exportMonth();break;
 case 'csv-history':if(!canSeeFinance())throw Error('Sem acesso ao histórico.');exportHistory();break;
 case 'print':if(!canSeeFinance())throw Error('Sem acesso ao financeiro.');printFinance();break;
 case 'share-month':if(!canSeeFinance())throw Error('Sem acesso ao financeiro.');await shareMonth();break;
 case 'toggle-cancelled':state.showCancelled=!state.showCancelled;updateCurrentPage();break;
 case 'edit':{const o=orders().find(o=>o.id===btn.dataset.id);if(o&&canEditOrders())popupEdit(o);break}
 case 'cancel':{const o=orders().find(o=>o.id===btn.dataset.id);if(o&&canEditOrders())popupCancel(o);break}
 case 'confirm-cancel':await cancelOrder(orders().find(o=>o.id===btn.dataset.id));break;
 case 'details':if(!canSeeFinance())throw Error('Sem acesso ao financeiro.');popupDetails(btn.dataset.name);break;
 case 'logout':await logout();break;
 case 'reset-config':stopRealtime();localStorage.removeItem(CONFIG_STORAGE);state.cloudConfig=null;state.mode='local';state.sb=null;state.profile=null;state.data=getLocal();renderLocalEntry();break;
 }}
async function onForm(form){switch(form.id){
     case 'self-password-form':await changeOwnPassword(form);break;
 case 'create-user-form':await createUser(form);break;
 case 'order-form':await saveOrder(form);break;
 case 'edit-order-form':await saveEdit(form);break;
 case 'new-size-form':await newPrice(form);break;
 case 'bulk-form':await importBulk(form);break;
 case 'connect-form':{const url=form.elements.url.value.trim().replace(/\/$/,'');const key=form.elements.key.value.trim();if(!/^https:\/\/[\w.-]+\.supabase\.co$/.test(url))throw Error('Use a URL HTTPS do seu projeto Supabase.');state.cloudConfig={url,key};localStorage.setItem(CONFIG_STORAGE,JSON.stringify(state.cloudConfig));closeModal();await connectCloud();break}
 case 'login-form':{const btn=form.querySelector('button[type=submit]');btn.disabled=true;try{await login(form.elements.email.value.trim(),form.elements.password.value)}catch(err){renderLogin(errorMessage(err))}break}
 default:if(form.dataset.priceForm)await savePrice(form);
 }}
document.addEventListener('click',async e=>{if(e.target.matches('[data-close-backdrop]')){closeModal();return}const btn=e.target.closest('[data-action]');if(!btn||btn.disabled)return;btn.disabled=true;try{await handleAction(btn)}catch(err){toast('Não foi possível concluir: '+errorMessage(err))}finally{if(btn.isConnected)btn.disabled=false}});
document.addEventListener('submit',async e=>{const f=e.target;if(!f.matches('form'))return;e.preventDefault();const submit=f.querySelector('[type=submit]');if(submit?.disabled)return;if(submit)submit.disabled=true;try{await onForm(f)}catch(err){toast('Erro: '+errorMessage(err));if(f.id==='login-form')renderLogin(errorMessage(err))}finally{if(submit?.isConnected)submit.disabled=false}});
document.addEventListener('change',e=>{const el=e.target;switch(el.id){case 'day-select':state.date=isOperator()?dateToday():el.value;updateCurrentPage();break;case 'supplier-month':case 'month-select':case 'history-month':state.month=el.value;updateCurrentPage();break;case 'finance-search':state.query=el.value;updateCurrentPage();break;case 'report-company':state.reportCompany=el.value.trim().slice(0,100);try{localStorage.setItem('nexa_marmitas_report_company',state.reportCompany)}catch(e){}break;case 'order-size':{const s=sizes().find(s=>s.id===el.value);const preview=byId('price-preview');if(preview)preview.innerHTML=`${money(s?.price_cents||0)}<span class="subtext">Preço cadastrado</span>`;break}}});
if(state.cloudConfig){connectCloud()}else{renderLocalEntry()}
