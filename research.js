/* Additional research views use the original site's public numerical tables. */
(() => {
  'use strict';
  const data = window.ROBO_WEAVE_DATA;
  if (!data) return;
  const $ = (selector) => document.querySelector(selector);
  let metric = 'sr';
  const groups = ['L0','L1-A','L1-M','L1-P','L1-V','L2'];

  function renderTable() {
    const stepMetric = metric === 'aas';
    const rows = stepMetric ? data.stepResults : data.results;
    const sortIndex = Number($('#result-sort').value);
    const agents = rows.filter((row) => row.kind === 'agent').slice().sort((a,b) => stepMetric ? a.values[sortIndex]-b.values[sortIndex] : b.values[sortIndex]-a.values[sortIndex]);
    const references = rows.filter((row) => row.kind === 'human');
    const best = groups.map((_, i) => (stepMetric ? Math.min : Math.max)(...agents.map((row) => row.values[i])));
    const body = $('#results-table');
    body.replaceChildren();
    for (const row of [...agents,...references]) {
      const tr = document.createElement('tr'); tr.dataset.result = row.id;
      tr.classList.toggle('human-row', row.kind === 'human');
      tr.classList.toggle('harness-row', row.kind === 'agent' && row.harness !== 'Base');
      tr.classList.toggle('selected-result', row.id === $('#model-select').value);
      for (const text of [row.model,row.harness]) { const cell = document.createElement('td');cell.textContent=text;tr.append(cell); }
      row.values.forEach((value,index) => { const cell=document.createElement('td');cell.textContent=value.toFixed(2);if(!stepMetric&&row.kind==='agent'&&value===best[index])cell.classList.add('result-best');tr.append(cell); });
      body.append(tr);
    }
    $('#metric-note').textContent = stepMetric
      ? 'Average Action Steps (AAS) · recorded action decisions. Read together with success; lower counts alone do not establish better performance.'
      : 'Task Success Rate (SR, %) · higher is better. L0: 100 tasks; each L1 subset: 30; L2: 20.';
    $('#result-caption').textContent = stepMetric
      ? 'Average Action Steps, reproduced from the manuscript. Per-episode aggregation awaits raw-data verification. The Human row follows the separate human evaluation protocol.'
      : 'Task Success Rate (SR, %). Model backbone and harness are separate columns. Human references follow the manuscript’s separate human evaluation protocol.';
    document.querySelectorAll('[data-metric]').forEach((button) => button.setAttribute('aria-pressed',String(button.dataset.metric===metric)));
    $('#result-sort').setAttribute('aria-label',`Sort detailed ${stepMetric?'action steps':'success rates'} by task group`);
  }
  document.querySelectorAll('[data-metric]').forEach((button) => button.addEventListener('click',()=>{metric=button.dataset.metric;renderTable();}));
  $('#result-sort').addEventListener('change',renderTable);
  $('#model-select').addEventListener('change',renderTable);
  renderTable();

  const colors = new Map([
    ['GPT-6 Astra','#79bdff'],['GPT-5.6 Sol','#8ed7bb'],['Opus 5.5','#ffaf72'],['Gemini-3.8-Flash','#baadff'],['DeepSeek-V4.1-Flash','#d3ce8f'],['GLM-5.3-Flash','#e99bb7'],['Qwen3.8-Max','#8bcbd7'],['Qwen3.8-27B','#c5a888'],
  ]);
  const lightColors = new Map([
    ['GPT-6 Astra','#2465b5'],['GPT-5.6 Sol','#22785d'],['Opus 5.5','#ad591b'],['Gemini-3.8-Flash','#7452b0'],['DeepSeek-V4.1-Flash','#747127'],['GLM-5.3-Flash','#a33d66'],['Qwen3.8-Max','#247787'],['Qwen3.8-27B','#846743'],
  ]);
  const svgNS = 'http://www.w3.org/2000/svg';
  function svgElement(name,attributes,text) {
    const element=document.createElementNS(svgNS,name);
    for(const [key,value] of Object.entries(attributes||{}))element.setAttribute(key,String(value));
    if(text!==undefined)element.textContent=text;
    return element;
  }
  function renderScatter() {
    const index=Number($('#scatter-capability').value);
    const svg=svgElement('svg',{viewBox:'0 0 720 365',role:'img','aria-label':`${groups[index]}: success rate versus average action steps across 10 evaluated agent configurations`});
    const plot={left:52,top:20,width:644,height:287};
    for(let value=0;value<=100;value+=20){const y=plot.top+plot.height*(1-value/100);svg.append(svgElement('line',{x1:plot.left,y1:y,x2:plot.left+plot.width,y2:y,stroke:'var(--line)','stroke-width':1}));svg.append(svgElement('text',{x:plot.left-12,y:y+4,'text-anchor':'end',fill:'var(--muted)','font-size':11},String(value)));}
    for(let value=0;value<=50;value+=10){const x=plot.left+plot.width*value/50;svg.append(svgElement('text',{x,y:330,'text-anchor':'middle',fill:'var(--muted)','font-size':11},String(value)));}
    svg.append(svgElement('text',{x:plot.left,y:10,fill:'var(--muted)','font-size':10},'Success rate (%)'));
    svg.append(svgElement('text',{x:plot.left+plot.width/2,y:355,'text-anchor':'middle',fill:'var(--muted)','font-size':11},'Average action steps'));
    const legend=$('#scatter-legend');legend.replaceChildren();
    data.results.filter((row)=>row.kind==='agent').forEach((row)=>{
      const steps=data.stepResults.find((candidate)=>candidate.id===row.id);
      const label=row.model+(row.harness==='Base'?' · Base':' + '+row.harness);
      const valueText=`${label}: ${row.values[index].toFixed(2)}% success · ${steps.values[index].toFixed(2)} average action steps`;
      const palette=document.documentElement.dataset.theme==='light'?lightColors:colors;
      const color=palette.get(row.model)||'var(--muted)';
      const filled=row.harness!=='Base';
      const circle=svgElement('circle',{cx:plot.left+plot.width*steps.values[index]/50,cy:plot.top+plot.height*(1-row.values[index]/100),r:6.5,stroke:color,'stroke-width':2.2,fill:filled?color:'var(--bg)',tabindex:0,'aria-label':valueText,'data-scatter-model':row.id});
      circle.append(svgElement('title',{},valueText));
      const show=()=>{$('#scatter-readout').textContent=valueText;};
      circle.addEventListener('mouseenter',show);circle.addEventListener('focus',show);
      svg.append(circle);
      const item=document.createElement('span');const dot=document.createElement('i');dot.style.borderColor=color;dot.style.background=filled?color:'var(--bg)';item.append(dot,document.createTextNode(label));legend.append(item);
    });
    $('#research-scatter').replaceChildren(svg);
    $('#scatter-readout').textContent='Hover or focus a point to read its exact values.';
  }
  $('#scatter-capability').addEventListener('change',renderScatter);
  new MutationObserver(renderScatter).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
  renderScatter();

  const dialog=$('#figure-dialog');
  const image=$('#figure-image');
  document.querySelectorAll('[data-figure]').forEach((button)=>button.addEventListener('click',()=>{
    image.src=button.dataset.figure;
    image.alt=button.dataset.figureTitle||'Original research figure';
    image.classList.remove('actual-size');
    $('#figure-dialog-title').textContent=image.alt;
    $('#figure-size').textContent='Actual size';
    dialog.showModal();document.body.style.overflow='hidden';
    image.parentElement.scrollTop=0;image.parentElement.scrollLeft=0;
  }));
  $('#figure-size').addEventListener('click',()=>{image.classList.toggle('actual-size');$('#figure-size').textContent=image.classList.contains('actual-size')?'Fit to screen':'Actual size';});
  $('#figure-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('close',()=>{document.body.style.overflow='';});
  dialog.addEventListener('click',(event)=>{if(event.target===dialog){const bounds=dialog.getBoundingClientRect();if(event.clientX<bounds.left||event.clientX>bounds.right||event.clientY<bounds.top||event.clientY>bounds.bottom)dialog.close();}});
})();
