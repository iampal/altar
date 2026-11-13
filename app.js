const STORAGE_KEY = 'altar_workspace_v1';
const defaultState = {
  channels: [], sources: [], tasks: [], launchAt: '',
  githubRepo: 'iampal/altar', githubStats: null,
  lastPage: 'overview'
};
let state = loadState();
let generatedPrompt = '';
let toastTimer;

function loadState() {
  try { return { ...defaultState, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') }; }
  catch { return structuredClone(defaultState); }
}
function saveState() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); renderAll(); }
function escapeHTML(value='') { return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function formatNumber(n) { return new Intl.NumberFormat().format(Number(n)||0); }
function conversion(clicks, signups) { return Number(clicks) ? `${(100*Number(signups)/Number(clicks)).toFixed(1)}%` : '0%'; }
function toast(text) { const el=document.querySelector('#toast'); el.textContent=text; el.classList.add('show'); clearTimeout(toastTimer); toastTimer=setTimeout(()=>el.classList.remove('show'),2400); }
function iconFor(name='') { return ({'X':'𝕏','Instagram':'◎','YouTube':'▶','LinkedIn':'in','Reddit':'r/','Product Hunt':'P','GitHub':'GH','TikTok':'♪','Newsletter':'✉'})[name] || name.slice(0,2).toUpperCase(); }

const pageTitles = {
  overview:['Overview','Your launch, at a glance.'], channels:['Channels','Your accounts, one operating view.'],
  attribution:['Attribution','Know which links lead to signups.'], copy:['Copy studio','One launch story, shaped for every channel.'],
  milestones:['Milestones','Make the next launch manageable.'], connections:['Connections','Bring your signals together safely.']
};
function showPage(name) {
  if(!pageTitles[name]) return;
  document.querySelectorAll('.page').forEach(p=>p.classList.toggle('active',p.id===`page-${name}`));
  document.querySelectorAll('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.page===name));
  document.querySelector('#pageLabel').textContent=pageTitles[name][0];
  document.querySelector('#pageTitle').textContent=pageTitles[name][1];
  state.lastPage=name; localStorage.setItem(STORAGE_KEY,JSON.stringify(state));
  window.scrollTo({top:0,behavior:'smooth'});
}
document.querySelectorAll('.nav-item').forEach(b=>b.addEventListener('click',()=>showPage(b.dataset.page)));
document.querySelectorAll('[data-goto]').forEach(b=>b.addEventListener('click',()=>showPage(b.dataset.goto)));

function renderAll() { renderOverview(); renderChannels(); renderSources(); renderTasks(); renderCountdown(); document.querySelector('#channelCount').textContent=state.channels.length; }
function renderOverview() {
  const totals=state.channels.reduce((a,c)=>({impressions:a.impressions+(+c.impressions||0),clicks:a.clicks+(+c.clicks||0),signups:a.signups+(+c.signups||0)}),{impressions:0,clicks:0,signups:0});
  totals.clicks += state.sources.reduce((a,s)=>a+(+s.clicks||0),0);
  totals.signups += state.sources.reduce((a,s)=>a+(+s.signups||0),0);
  document.querySelector('#totalImpressions').textContent=formatNumber(totals.impressions);
  document.querySelector('#totalClicks').textContent=formatNumber(totals.clicks);
  document.querySelector('#totalSignups').textContent=formatNumber(totals.signups);
  document.querySelector('#overallConversion').textContent=conversion(totals.clicks,totals.signups);
  const bars=document.querySelector('#overviewChannels');
  if(!state.channels.length) { bars.className='channel-bars empty-state'; bars.textContent='Add your first account or channel to see a comparison.'; }
  else {
    bars.className='channel-bars'; const max=Math.max(1,...state.channels.map(c=>+c.clicks||0));
    bars.innerHTML=state.channels.slice(0,7).map(c=>`<div class="bar-row"><span class="bar-label">${escapeHTML(c.platform)}</span><div class="bar-track"><div class="bar-fill" style="width:${Math.max(3,100*(+c.clicks||0)/max)}%"></div></div><span class="bar-count">${formatNumber(c.clicks)} · ${formatNumber(c.signups)}</span></div>`).join('');
  }
  const src=document.querySelector('#overviewSources');
  if(!state.sources.length) { src.className='source-list empty-state'; src.textContent='Add referral data to learn what is converting.'; }
  else {
    src.className='source-list';
    src.innerHTML=[...state.sources].sort((a,b)=>(+b.signups||0)-(+a.signups||0)).slice(0,4).map(s=>`<div class="source-line"><span>${escapeHTML(s.name)}<small>${escapeHTML(s.campaign||'Unlabelled campaign')}</small></span><b>${formatNumber(s.clicks)}<small>clicks</small></b><b>${formatNumber(s.signups)}<small>signups</small></b></div>`).join('');
  }
  document.querySelector('#ghStars').textContent=state.githubStats?formatNumber(state.githubStats.stars):'—';
  document.querySelector('#ghForks').textContent=state.githubStats?formatNumber(state.githubStats.forks):'—';
  document.querySelector('#ghIssues').textContent=state.githubStats?formatNumber(state.githubStats.issues):'—';
  document.querySelector('#githubStatus').textContent=state.githubStats?`Updated ${new Date(state.githubStats.updated).toLocaleString()}`:'Connect a public GitHub repository in Connections.';
  const done=state.tasks.filter(t=>t.done).length;
  document.querySelector('#checkProgress').textContent=`${done} of ${state.tasks.length} complete`;
  const mini=document.querySelector('#overviewChecklist');
  mini.innerHTML=state.tasks.length?state.tasks.slice(0,4).map(t=>`<label class="mini-task ${t.done?'done':''}"><input type="checkbox" data-task-check="${escapeHTML(t.id)}" ${t.done?'checked':''}><span>${escapeHTML(t.title)}</span></label>`).join(''):'<div class="empty-state">Add launch tasks in Milestones.</div>';
  mini.querySelectorAll('[data-task-check]').forEach(cb=>cb.addEventListener('change',()=>toggleTask(cb.dataset.taskCheck)));
}
function renderChannels() {
  const tbody=document.querySelector('#channelRows'), empty=document.querySelector('#channelEmpty');
  empty.hidden=state.channels.length>0;
  tbody.innerHTML=state.channels.map(c=>`<tr><td><div class="channel-name"><span class="channel-avatar">${escapeHTML(iconFor(c.platform))}</span><span><b>${escapeHTML(c.platform)}</b><small>${escapeHTML(c.handle||'Account')}</small></span></div></td><td>${formatNumber(c.followers)}</td><td>${formatNumber(c.impressions)}</td><td>${formatNumber(c.clicks)}</td><td>${formatNumber(c.signups)}</td><td>${conversion(c.clicks,c.signups)}</td><td><div class="table-actions"><button class="mini-action" data-edit-channel="${escapeHTML(c.id)}">Edit</button><button class="mini-action" data-delete-channel="${escapeHTML(c.id)}">×</button></div></td></tr>`).join('');
  tbody.querySelectorAll('[data-edit-channel]').forEach(b=>b.addEventListener('click',()=>openChannel(b.dataset.editChannel)));
  tbody.querySelectorAll('[data-delete-channel]').forEach(b=>b.addEventListener('click',()=>deleteChannel(b.dataset.deleteChannel)));
}
function renderSources() {
  const box=document.querySelector('#sourceRows');
  if(!state.sources.length){box.innerHTML='<div class="empty-state">No sources logged yet.</div>';return;}
  box.innerHTML='<div class="source-table-row head"><span>SOURCE</span><span>CAMPAIGN</span><span>CLICKS</span><span>SIGNUPS</span><span>RATE</span><span></span></div>'+state.sources.map(s=>`<div class="source-table-row"><span>${escapeHTML(s.name)}</span><span>${escapeHTML(s.campaign||'—')}</span><b>${formatNumber(s.clicks)}</b><b>${formatNumber(s.signups)}</b><span>${conversion(s.clicks,s.signups)}</span><button class="mini-action" data-delete-source="${escapeHTML(s.id)}">×</button></div>`).join('');
  box.querySelectorAll('[data-delete-source]').forEach(b=>b.addEventListener('click',()=>{state.sources=state.sources.filter(s=>s.id!==b.dataset.deleteSource);saveState();}));
}
function renderTasks() {
  const list=document.querySelector('#taskList'), done=state.tasks.filter(t=>t.done).length;
  document.querySelector('#fullCheckProgress').textContent=`${done} of ${state.tasks.length} complete`;
  document.querySelector('#taskEmpty').hidden=state.tasks.length>0;
  list.innerHTML=state.tasks.map(t=>`<label class="task-item ${t.done?'done':''}"><input type="checkbox" data-task-check="${escapeHTML(t.id)}" ${t.done?'checked':''}><span>${escapeHTML(t.title)}</span><button class="mini-action" data-delete-task="${escapeHTML(t.id)}" type="button">Remove</button></label>`).join('');
  list.querySelectorAll('[data-task-check]').forEach(cb=>cb.addEventListener('change',()=>toggleTask(cb.dataset.taskCheck)));
  list.querySelectorAll('[data-delete-task]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();state.tasks=state.tasks.filter(t=>t.id!==b.dataset.deleteTask);saveState();}));
}
function toggleTask(id){const t=state.tasks.find(x=>x.id===id);if(t)t.done=!t.done;saveState();if(t?.done)maybeCelebrate();}
function maybeCelebrate(){const done=state.tasks.filter(t=>t.done).length;if(done&&done%5===0)confetti();}
function confetti(){for(let i=0;i<34;i++){const el=document.createElement('i');el.className='confetti-piece';el.style.left=`${Math.random()*100}vw`;el.style.background=['#b9a4ff','#59dfb2','#ffce75','#71b7ff'][i%4];document.body.append(el);setTimeout(()=>el.remove(),1700);}}

const dialog=document.querySelector('#channelDialog');
document.querySelector('#addChannel').addEventListener('click',()=>openChannel());
function openChannel(id='') {
  const c=state.channels.find(x=>x.id===id);document.querySelector('#dialogTitle').textContent=c?'Edit channel':'Add channel';
  document.querySelector('#editChannelId').value=c?.id||'';document.querySelector('#channelPlatform').value=c?.platform||'X';document.querySelector('#channelHandle').value=c?.handle||'';
  document.querySelector('#channelFollowers').value=c?.followers||0;document.querySelector('#channelImpressions').value=c?.impressions||0;document.querySelector('#channelClicks').value=c?.clicks||0;document.querySelector('#channelSignups').value=c?.signups||0;dialog.showModal();
}
document.querySelector('#channelForm').addEventListener('submit',e=>{
  if(e.submitter?.value==='cancel')return;
  e.preventDefault();const id=document.querySelector('#editChannelId').value||crypto.randomUUID();
  const item={id,platform:document.querySelector('#channelPlatform').value,handle:document.querySelector('#channelHandle').value.trim(),followers:+document.querySelector('#channelFollowers').value||0,impressions:+document.querySelector('#channelImpressions').value||0,clicks:+document.querySelector('#channelClicks').value||0,signups:+document.querySelector('#channelSignups').value||0};
  const index=state.channels.findIndex(c=>c.id===id);if(index>=0)state.channels[index]=item;else state.channels.push(item);dialog.close();saveState();toast('Channel saved locally.');
});
function deleteChannel(id){if(!confirm('Remove this channel and its saved metrics?'))return;state.channels=state.channels.filter(c=>c.id!==id);saveState();}

document.querySelector('#sourceForm').addEventListener('submit',e=>{e.preventDefault();state.sources.push({id:crypto.randomUUID(),name:document.querySelector('#sourceName').value.trim(),campaign:document.querySelector('#sourceCampaign').value.trim(),clicks:+document.querySelector('#sourceClicks').value||0,signups:+document.querySelector('#sourceSignups').value||0});e.target.reset();document.querySelector('#sourceClicks').value=0;document.querySelector('#sourceSignups').value=0;saveState();toast('Referral source added.');});
document.querySelector('#clearSources').addEventListener('click',()=>{if(confirm('Clear all logged referral source data?')){state.sources=[];saveState();}});
document.querySelector('#utmForm').addEventListener('submit',e=>{e.preventDefault();const raw=document.querySelector('#utmUrl').value;let url;try{url=new URL(raw)}catch{toast('Enter a valid destination URL.');return;}const params={utm_source:document.querySelector('#utmSource').value.trim(),utm_medium:document.querySelector('#utmMedium').value.trim(),utm_campaign:document.querySelector('#utmCampaign').value.trim(),utm_content:document.querySelector('#utmContent').value.trim()};for(const [k,v] of Object.entries(params))if(v)url.searchParams.set(k,v);document.querySelector('#generatedUrl').textContent=url.toString();document.querySelector('#generatedLink').hidden=false;});
document.querySelector('#copyUtm').addEventListener('click',()=>copyText(document.querySelector('#generatedUrl').textContent,'Tracked link copied.'));
async function copyText(text,message){try{await navigator.clipboard.writeText(text);toast(message);}catch{toast('Copy unavailable here; select and copy the text.');}}

function makeCopy(channel,product,audience,problem,proof){
  const audiencePhrase=audience?` for ${audience}`:'';const problemPhrase=problem||'the work that slows your launch down';const proofPhrase=proof?`\n\n${proof}`:'';
  const drafts={
    x:`I built ${product}${audiencePhrase} because ${problemPhrase}.\n\n${proof||'It helps make the next step simpler.'}\n\nWhat would you want to see next?`,
    linkedin:`I’ve been working on ${product}${audiencePhrase}.\n\nThe problem I wanted to solve: ${problemPhrase}.\n\n${proof||'The goal is to make this workflow more practical and less painful.'}\n\nI’d love feedback from people who work on this. What would make it more useful for you?`,
    producthunt:`Hey Product Hunt! I made ${product}${audiencePhrase} to help with ${problemPhrase}.\n\n${proof||'I’m sharing it today and would love your honest feedback.'}\n\nWhat should I improve next?`,
    reddit:`I made ${product}${audiencePhrase} after running into ${problemPhrase}.\n\n${proof||'I’m looking for feedback from people who have this problem too.'}\n\nWhat do you currently use for this? What would make a tool like this genuinely helpful?`
  };
  const platform={x:'X post or thread',linkedin:'LinkedIn post',producthunt:'Product Hunt maker comment',reddit:'Reddit launch post'}[channel];
  const instruction=`Write a clear, specific ${platform} for this launch. Use a natural first-person voice, avoid exaggerated claims, and end with one useful question or call to action. Keep it appropriate for its platform.\n\nProduct: ${product}\nAudience: ${audience||'not specified'}\nProblem solved: ${problemPhrase}\nProof, feature, or link: ${proof||'not specified'}\n\nReturn one polished draft, then a shorter variant. Do not invent facts.`;
  return {draft:drafts[channel],prompt:instruction};
}
document.querySelector('#copyForm').addEventListener('submit',e=>{e.preventDefault();const product=document.querySelector('#copyProduct').value.trim(),aud=document.querySelector('#copyAudience').value.trim(),problem=document.querySelector('#copyProblem').value.trim(),proof=document.querySelector('#copyProof').value.trim(),channel=document.querySelector('#copyChannel').value;const result=makeCopy(channel,product,aud,problem,proof);document.querySelector('#copyOutput').value=result.draft;generatedPrompt=result.prompt;document.querySelector('#promptOutput').textContent=generatedPrompt;toast('Draft and AI-ready prompt created. Review before posting.');});
document.querySelector('#copyDraft').addEventListener('click',()=>copyText(document.querySelector('#copyOutput').value,'Draft copied.'));
document.querySelector('#copyPrompt').addEventListener('click',()=>copyText(generatedPrompt,'AI prompt copied.'));

const dateInput=document.querySelector('#launchDate');dateInput.value=state.launchAt||'';dateInput.addEventListener('change',()=>{state.launchAt=dateInput.value;saveState();});
document.querySelector('#clearLaunchDate').addEventListener('click',()=>{state.launchAt='';dateInput.value='';saveState();});
document.querySelector('#addTask').addEventListener('click',()=>{const title=prompt('What needs to get done?');if(title?.trim()){state.tasks.push({id:crypto.randomUUID(),title:title.trim(),done:false});saveState();}});
function renderCountdown(){const el=document.querySelector('#countdown'),large=document.querySelector('#milestoneCountdown');if(!state.launchAt){el.textContent='Set a date';large.textContent='Choose a launch date';return;}const diff=new Date(state.launchAt)-new Date();if(diff<=0){el.textContent='Launch day';large.textContent='It’s launch time.';return;}const days=Math.floor(diff/86400000),hours=Math.floor(diff%86400000/3600000);el.textContent=`${days}d ${hours}h`;large.textContent=`${days} days · ${hours} hours`;}
setInterval(renderCountdown,60000);

async function fetchGithub(){const input=document.querySelector('#githubRepo').value.trim();const status=document.querySelector('#githubConnectStatus');const link=document.querySelector('#githubRepoLink');if(!/^[\w.-]+\/[\w.-]+$/.test(input)){status.textContent='Use owner/repository format.';return;}status.textContent='Fetching public repository details…';link.href=`https://github.com/${input}`;state.githubRepo=input;localStorage.setItem(STORAGE_KEY,JSON.stringify(state));try{const response=await fetch(`https://api.github.com/repos/${input}`,{headers:{Accept:'application/vnd.github+json'}});if(!response.ok)throw new Error(response.status===404?'Repository not found or not public.':`GitHub returned ${response.status}.`);const repo=await response.json();state.githubStats={stars:repo.stargazers_count,forks:repo.forks_count,issues:repo.open_issues_count,updated:new Date().toISOString()};saveState();status.textContent=`Fetched public metrics for ${repo.full_name}. Updated ${new Date().toLocaleTimeString()}.`;toast('GitHub public metrics refreshed.');}catch(err){status.textContent=`Could not fetch: ${err.message}`;}}
document.querySelector('#connectGithub').addEventListener('click',fetchGithub);document.querySelector('#refreshGithub').addEventListener('click',()=>{showPage('connections');fetchGithub();});
document.querySelector('#githubRepo').value=state.githubRepo||'iampal/altar';document.querySelector('#githubRepoLink').href=`https://github.com/${state.githubRepo||'iampal/altar'}`;if(state.githubStats){document.querySelector('#githubConnectStatus').textContent=`Last saved refresh: ${new Date(state.githubStats.updated).toLocaleString()}`;}

function drawCard(){const title=document.querySelector('#milestoneTitle').value.trim(),detail=document.querySelector('#milestoneDetail').value.trim(),color=document.querySelector('#milestoneColor').value;if(!title){toast('Add a milestone headline first.');return;}const canvas=document.querySelector('#shareCanvas'),ctx=canvas.getContext('2d');const gradient=ctx.createLinearGradient(0,0,1200,630);gradient.addColorStop(0,'#151725');gradient.addColorStop(.58,'#25213b');gradient.addColorStop(1,'#1c3435');ctx.fillStyle=gradient;ctx.fillRect(0,0,1200,630);ctx.fillStyle=color;ctx.globalAlpha=.13;ctx.beginPath();ctx.arc(1050,80,300,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;ctx.strokeStyle=color;ctx.globalAlpha=.7;ctx.lineWidth=2;ctx.beginPath();ctx.arc(1000,330,185,0,Math.PI*2);ctx.stroke();ctx.globalAlpha=1;ctx.fillStyle=color;ctx.font='700 22px Manrope, sans-serif';ctx.fillText('ALTAR  /  MILESTONE UNLOCKED',72,100);ctx.fillStyle='#f5f3ff';ctx.font='800 64px Manrope, sans-serif';wrapCanvasText(ctx,title,72,250,900,78);ctx.fillStyle='#bab8c9';ctx.font='400 25px Manrope, sans-serif';if(detail)wrapCanvasText(ctx,detail,74,410,900,38);ctx.fillStyle='#8e8da4';ctx.font='500 18px monospace';ctx.fillText('AUTOMATED LAUNCH TRACKER AND REPORTING',74,555);document.querySelector('#shareCardWrap').hidden=false;confetti();}
function wrapCanvasText(ctx,text,x,y,maxWidth,lineHeight){const words=text.split(/\s+/);let line='';for(const word of words){const test=line?`${line} ${word}`:word;if(ctx.measureText(test).width>maxWidth&&line){ctx.fillText(line,x,y);line=word;y+=lineHeight;}else line=test;}if(line)ctx.fillText(line,x,y);}
document.querySelector('#makeCard').addEventListener('click',drawCard);
document.querySelector('#downloadCard').addEventListener('click',()=>{const a=document.createElement('a');a.download='altar-milestone.png';a.href=document.querySelector('#shareCanvas').toDataURL('image/png');a.click();});
document.querySelector('#shareX').addEventListener('click',()=>{const title=document.querySelector('#milestoneTitle').value.trim();const url=`https://twitter.com/intent/tweet?text=${encodeURIComponent(`${title} — tracking the build with ALTAR.`)}&url=${encodeURIComponent('https://github.com/iampal/altar')}`;window.open(url,'_blank','noopener,noreferrer');});

document.querySelector('#exportData').addEventListener('click',()=>{const data=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(data);a.download='altar-workspace-backup.json';a.click();URL.revokeObjectURL(a.href);toast('Workspace backup exported.');});
document.querySelector('#today').textContent=new Intl.DateTimeFormat(undefined,{weekday:'short',month:'short',day:'numeric'}).format(new Date());
renderAll();showPage(state.lastPage||'overview');
