const KEY="hpp-elquirazh-v1";

const initialData={
  materials:[
    {id:"vinyl152",name:"Vinyl Exillo 152",machine:"indoor",price:14500,unit:"meter",note:"Lebar 152 cm; roll 50 m"},
    {id:"vinyl127",name:"Vinyl Exillo 127",machine:"indoor",price:14500,unit:"meter",note:"Lebar 127 cm; roll 50 m"},
    {id:"vinyl105",name:"Vinyl Exillo 106/105",machine:"indoor",price:14500,unit:"meter",note:"Lebar 105/106 cm; roll 50 m"},
    {id:"phosphor",name:"Bahan Fosfor",machine:"cutting",price:35500,unit:"meter",note:"Lebar 60 cm; data harga per 100 cm panjang"},
    {id:"acrylic2clear",name:"Acrylic Bening 2 mm",machine:"laser",price:572000,unit:"lembar",note:"122 × 244 cm"},
    {id:"hvs80",name:"HVS 80 gr",machine:"docu",price:48000,unit:"rim",note:"500 lembar"},
    {id:"ap120",name:"Artpaper 120 gr",machine:"docu",price:112500,unit:"rim",note:"500 lembar"},
    {id:"ap150",name:"Artpaper 150 gr",machine:"docu",price:170000,unit:"rim",note:"500 lembar"},
    {id:"ivory210",name:"Ivory 210 gr",machine:"docu",price:262500,unit:"rim",note:"500 lembar"},
    {id:"ivory230",name:"Ivory 230 gr",machine:"docu",price:300000,unit:"rim",note:"500 lembar"},
    {id:"ivory260",name:"Ivory 260 gr",machine:"docu",price:325000,unit:"rim",note:"500 lembar"},
    {id:"cromo",name:"Sticker Cromo",machine:"docu",price:275000,unit:"rim",note:"500 lembar"},
    {id:"vinylA3",name:"Sticker Vinyl",machine:"docu",price:280000,unit:"paket",note:"100 lembar"},
    {id:"transA3",name:"Sticker Transparan",machine:"docu",price:280000,unit:"paket",note:"100 lembar"}
  ],
  machines:{
    indoor:{name:"Printing Indoor",purchase:75000000,power:1500,electric:1600,headCost:15500000,headLifeHours:3*365*8,inkCostPerMeterFull:2000,note:"Tinta aktual belum dikunci; RIP menyediakan estimasi ml."},
    cutting:{name:"Mesin Cutting",purchase:0,power:40,standby:15,electric:1600,cutPerCm:5,maskingPerCm:4,note:"Harga jasa cutting Rp5/cm berasal dari pengalaman lama; masking Rp4/cm."},
    laser:{name:"Laser CO₂ 40W",purchase:0,power:500,standby:70,electric:1600,tubeCost:2800000,tubeLifeHours:5000,note:"Tabung Rp2,8 jt dan estimasi umur 5.000 jam; harga acrylic mengikuti pricelist."},
    docu:{name:"Xerox 7855",purchase:9000000,power:1200,electric:1600,tonerBlack:450000,tonerCyan:450000,tonerMagenta:450000,tonerYellow:450000,tonerPerSheet:0,kisscutA3:5000,laminationA3:2000,cutService:10000,note:"Konsumsi toner belum ditetapkan; parameter toner/lembar sengaja editable."}
  },
  benchmarks:[
    {name:"HVS 80 gr",a:2000,b:1600,c:1400,note:"Harga broker/member, 1 sisi"},
    {name:"HVS 100 gr",a:2600,b:1700,c:1600,note:"Harga broker/member, 1 sisi"},
    {name:"Bookpaper",a:2600,b:1900,c:1600,note:"Harga broker/member, 1 sisi"},
    {name:"Artpaper 120 gr",a:2800,b:1800,c:1600,note:"Harga broker/member, 1 sisi"},
    {name:"Artpaper 150 gr",a:2800,b:1900,c:1700,note:"Harga broker/member, 1 sisi"},
    {name:"Ivory 210/230 gr",a:3300,b:2800,c:2300,note:"Harga broker/member, 1 sisi"},
    {name:"Ivory 260 gr",a:4000,b:3000,c:2600,note:"Harga broker/member, 1 sisi"},
    {name:"Sticker Cromo",a:5200,b:4500,c:4000,note:"Harga broker/member"},
    {name:"Sticker Vinyl Matte",a:9000,b:8500,c:8000,note:"Harga broker/member"},
    {name:"Sticker Vinyl Glossy",a:10000,b:9500,c:9000,note:"Harga broker/member"},
    {name:"Sticker Vinyl Hologram Polos",a:16000,b:15000,c:14000,note:"Harga broker/member"},
    {name:"Sticker Transparant",a:10000,b:9500,c:9000,note:"Harga broker/member"}
  ]
};

let data=load();
let pendingSave=null;

function load(){try{return JSON.parse(localStorage.getItem(KEY))||structuredClone(initialData)}catch{return structuredClone(initialData)}}
function save(){localStorage.setItem(KEY,JSON.stringify(data))}
function rupiah(n){return new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(Math.round(n||0))}
function num(v){return Number(v)||0}
function el(id){return document.getElementById(id)}
function options(arr, selected=""){return arr.map(x=>`<option value="${x.id}" ${x.id===selected?"selected":""}>${x.name}</option>`).join("")}

const machineMeta=[
  ["indoor","Printing Indoor"],["cutting","Cutting"],["laser","Laser CO₂"],["docu","Docu A3+"]
];

function init(){
  el("machineSelect").innerHTML=machineMeta.map(([id,n])=>`<option value="${id}">${n}</option>`).join("");
  renderDynamicForm();
  renderMaterials();
  renderMachines();
  renderBenchmarks();
  document.querySelectorAll(".tab").forEach(b=>b.onclick=()=>switchTab(b.dataset.tab));
  el("machineSelect").onchange=renderDynamicForm;
  el("resetDataBtn").onclick=()=>{if(confirm("Reset semua data ke data awal?")){data=structuredClone(initialData);save();location.reload()}};
  el("addMaterialBtn").onclick=()=>openMaterialModal();
  el("closeModal").onclick=closeModal; el("cancelModal").onclick=closeModal;
  el("saveModal").onclick=saveModal;
}
function switchTab(id){document.querySelectorAll(".tab").forEach(x=>x.classList.toggle("active",x.dataset.tab===id));document.querySelectorAll(".tab-panel").forEach(x=>x.classList.toggle("active",x.id===id))}

function renderDynamicForm(){
  const m=el("machineSelect").value;
  const forms={
    indoor:`
      <div class="card">
        <h3>Parameter Printing Indoor</h3>
        <div class="grid two">
          <label>Panjang cetak (cm)<input id="iLength" type="number" value="100" min="0"></label>
          <label>Lebar cetak / arah jalan (cm)<input id="iWidth" type="number" value="50" min="0"></label>
          <label>Lebar roll<input id="iRoll" type="number" value="105" min="0"></label>
          <label>Pass<input id="iPass" type="number" value="4" min="1"></label>
          <label>Harga jual per m²<input id="iSell" type="number" value="75000" min="0"></label>
          <label>Estimasi tinta (Rp/m²)<input id="iInk" type="number" value="${data.machines.indoor.inkCostPerMeterFull}" min="0"></label>
        </div>
        <div class="notice">Aturan yang sudah kita sepakati: tepi kanan-kiri minimal ±2 cm dan awalan minimal 10 cm. Untuk contoh 100 × 50 cm, kebutuhan bahan menjadi sekitar 105 × 60 cm.</div>
        <button class="primary" onclick="calcIndoor()">Hitung HPP</button>
      </div>`,
    cutting:`
      <div class="card">
        <h3>Parameter Cutting</h3>
        <div class="grid two">
          <label>Panjang objek (cm)<input id="cLength" type="number" value="100" min="0"></label>
          <label>Lebar objek (cm)<input id="cWidth" type="number" value="50" min="0"></label>
          <label>Jumlah warna<input id="cColors" type="number" value="1" min="1"></label>
          <label>Harga jual cutting / cm / warna<input id="cSell" type="number" value="35" min="0"></label>
          <label>Biaya masking / cm<input id="cMask" type="number" value="4" min="0"></label>
        </div>
        <div class="notice">Bahan fosfor: Rp35.500 per 100 cm panjang, lebar 60 cm. Jasa cutting dasar Rp5/cm. Harga jual multiwarna selama ini bertambah sekitar Rp15/cm per warna tambahan.</div>
        <button class="primary" onclick="calcCutting()">Hitung HPP</button>
      </div>`,
    laser:`
      <div class="card">
        <h3>Parameter Laser CO₂</h3>
        <div class="grid two">
          <label>Tebal acrylic (mm)<input id="lThick" type="number" value="2" min="0.1" step="0.1"></label>
          <label>Jenis acrylic
            <select id="lType"><option value="clear">Bening</option><option value="milk">Susu</option><option value="rayban">Rayban</option><option value="color">Warna</option></select>
          </label>
          <label>Kode ukuran sheet
            <select id="lSize"><option value="T">T (92×183)</option><option value="M">M (100×200)</option><option value="L" selected>L (122×244)</option><option value="KK">KK (203×305)</option><option value="S">S (122×183)</option></select>
          </label>
          <label>Jumlah sheet terpakai<input id="lSheets" type="number" value="1" min="0"></label>
          <label>Waktu laser (menit)<input id="lMinutes" type="number" value="10" min="0"></label>
          <label>Harga jual produk<input id="lSell" type="number" value="150000" min="0"></label>
          <label>Biaya freelance<input id="lFreelance" type="number" value="0" min="0"></label>
        </div>
        <div class="notice">Tarif tabung dihitung dari Rp2.800.000 / 5.000 jam. Listrik kerja menggunakan 500 W. Harga acrylic dipilih dari database material/pricelist pada tahap pengembangan berikutnya.</div>
        <button class="primary" onclick="calcLaser()">Hitung HPP</button>
      </div>`,
    docu:`
      <div class="card">
        <h3>Parameter Docu A3+</h3>
        <div class="grid two">
          <label>Material
            <select id="dMat">${options(data.materials.filter(x=>x.machine==="docu"))}</select>
          </label>
          <label>Jumlah lembar<input id="dQty" type="number" value="100" min="1"></label>
          <label>Sisi cetak
            <select id="dSides"><option value="1">1 sisi</option><option value="2">2 sisi</option></select>
          </label>
          <label>Biaya toner / lembar<input id="dToner" type="number" value="${data.machines.docu.tonerPerSheet}" min="0"></label>
          <label>Kisscut A3+ (lembar)<input id="dKiss" type="number" value="0" min="0"></label>
          <label>Laminasi A3+ (lembar)<input id="dLam" type="number" value="0" min="0"></label>
          <label>Jasa potong eksternal<input id="dCut" type="number" value="0" min="0"></label>
          <label>Harga jual total<input id="dSell" type="number" value="1000000" min="0"></label>
        </div>
        <div class="notice">Area cetak maksimum Xerox 7855: 30,5 × 47 cm. Biaya toner sengaja dibuat parameter karena konsumsi aktual belum terukur.</div>
        <button class="primary" onclick="calcDocu()">Hitung HPP</button>
      </div>`
  };
  el("dynamicForm").innerHTML=forms[m];
}

function resultCard(title,hpp,sell,details){
  const margin=sell-hpp, pct=sell?margin/sell*100:0;
  const cls=margin<0?"profit-bad":pct<20?"profit-warn":"profit-good";
  el("result").innerHTML=`<div class="result-card">
    <h2>${title}</h2>
    <div class="result-grid">
      <div class="metric"><small>HPP</small><strong>${rupiah(hpp)}</strong></div>
      <div class="metric"><small>Harga jual</small><strong>${rupiah(sell)}</strong></div>
      <div class="metric"><small>Margin nominal</small><strong class="${cls}">${rupiah(margin)}</strong></div>
      <div class="metric"><small>Margin %</small><strong class="${cls}">${pct.toFixed(1)}%</strong></div>
    </div>
    <div class="formula">${details}</div>
  </div>`;
}

function calcIndoor(){
  const L=num(el("iLength").value), W=num(el("iWidth").value), roll=num(el("iRoll").value);
  const sellM2=num(el("iSell").value), ink=num(el("iInk").value);
  const usedW=W+10, usedL=L+5; // right/left waste represented approximately; editable in future
  const material=data.materials.find(x=>x.id==="vinyl"+String(roll))||data.materials.find(x=>x.machine==="indoor");
  const matCost=(usedL/100)*(material?.price||0);
  const area=(L/100)*(W/100);
  const inkCost=area*ink;
  const powerCost=(data.machines.indoor.power/1000)*0.1*data.machines.indoor.electric;
  const hpp=matCost+inkCost+powerCost;
  const sell=area*sellM2;
  resultCard("HPP Printing Indoor",hpp,sell,`Bahan: ${usedL.toFixed(1)} cm × ${usedW.toFixed(1)} cm ≈ ${rupiah(matCost)}
Tinta estimasi: ${rupiah(inkCost)}
Listrik sesi sederhana: ${rupiah(powerCost)}
Harga jual: ${rupiah(sell)}
Catatan: rumus waste kanan/kiri masih dibuat parameter pengembangan; jangan dianggap angka final.`)
}

function calcCutting(){
  const L=num(el("cLength").value), W=num(el("cWidth").value), colors=num(el("cColors").value);
  const sellCm=num(el("cSell").value), mask=num(el("cMask").value);
  const material=data.materials.find(x=>x.id==="phosphor");
  const lengthM=L/100;
  const matCost=lengthM*(material?.price||35500);
  const cutCost=L*data.machines.cutting.cutPerCm;
  const maskCost=L*mask;
  const hpp=matCost+cutCost+maskCost;
  const sell=L*sellCm*colors;
  resultCard("HPP Cutting",hpp,sell,`Bahan fosfor: ${lengthM.toFixed(2)} m × ${rupiah(material?.price||35500)} = ${rupiah(matCost)}
Cutting mesin: ${L} cm × Rp${data.machines.cutting.cutPerCm} = ${rupiah(cutCost)}
Masking: ${L} cm × Rp${mask} = ${rupiah(maskCost)}
Harga jual simulasi: ${L} × Rp${sellCm} × ${colors} warna = ${rupiah(sell)}
Contoh 100×50 dengan 1 warna: luas bahan mengikuti panjang material 100 cm × lebar roll 60 cm.`)
}

function calcLaser(){
  const sheets=num(el("lSheets").value), minutes=num(el("lMinutes").value), sell=num(el("lSell").value), freelance=num(el("lFreelance").value);
  const tubePerMin=data.machines.laser.tubeCost/(data.machines.laser.tubeLifeHours*60);
  const tubeCost=minutes*tubePerMin;
  const powerCost=(data.machines.laser.power/1000)*(minutes/60)*data.machines.laser.electric;
  const hpp=tubeCost+powerCost+freelance;
  resultCard("HPP Laser CO₂",hpp,sell,`Biaya tabung: ${rupiah(tubePerMin)}/menit × ${minutes} menit = ${rupiah(tubeCost)}
Listrik: 500 W × ${minutes} menit = ${rupiah(powerCost)}
Freelance: ${rupiah(freelance)}
Material acrylic: ${sheets} sheet — pemilihan harga per tebal/jenis/ukuran akan dikembangkan dari pricelist lengkap.`)
}

function calcDocu(){
  const mat=data.materials.find(x=>x.id===el("dMat").value);
  const qty=num(el("dQty").value), toner=num(el("dToner").value);
  const kiss=num(el("dKiss").value), lam=num(el("dLam").value), cut=num(el("dCut").value), sell=num(el("dSell").value);
  const perSheet=mat?.unit==="rim"?(mat.price/500):mat?.unit==="paket"?(mat.price/100):0;
  const materialCost=perSheet*qty;
  const tonerCost=toner*qty;
  const kissCost=kiss*data.machines.docu.kisscutA3;
  const lamCost=lam*data.machines.docu.laminationA3;
  const cutCost=cut*data.machines.docu.cutService;
  const powerCost=(data.machines.docu.power/1000)*0.1*data.machines.docu.electric;
  const hpp=materialCost+tonerCost+kissCost+lamCost+cutCost+powerCost;
  resultCard("HPP Docu A3+",hpp,sell,`Material: ${qty} lembar × ${rupiah(perSheet)} = ${rupiah(materialCost)}
Toner: ${qty} × ${rupiah(toner)} = ${rupiah(tonerCost)}
Kisscut: ${kiss} × Rp5.000 = ${rupiah(kissCost)}
Laminasi: ${lam} × Rp2.000 = ${rupiah(lamCost)}
Potong eksternal: ${cut} × Rp10.000 = ${rupiah(cutCost)}
Listrik: estimasi sesi sederhana ${rupiah(powerCost)}
Catatan: biaya toner/lembar saat ini default Rp0 sampai ada data aktual.`)
}

function renderMaterials(){
  el("materialsTable").innerHTML=data.materials.map(m=>`<tr>
    <td>${m.name}</td><td>${machineMeta.find(x=>x[0]===m.machine)?.[1]||m.machine}</td><td>${rupiah(m.price)}</td><td>${m.unit}</td><td>${m.note||""}</td>
    <td><div class="row-actions"><button class="ghost small" onclick="editMaterial('${m.id}')">Edit</button><button class="ghost small" onclick="deleteMaterial('${m.id}')">Hapus</button></div></td>
  </tr>`).join("");
}
function renderMachines(){
  el("machinesList").innerHTML=Object.entries(data.machines).map(([id,m])=>`<div class="machine-card">
    <h3>${m.name}</h3>
    <div class="machine-grid">
      ${Object.entries(m).filter(([k])=>k!=="name"&&k!=="note").map(([k,v])=>`<label>${k}<input data-machine="${id}" data-key="${k}" type="number" value="${v}"></label>`).join("")}
    </div>
    <p class="muted">${m.note||""}</p>
  </div>`).join("");
  document.querySelectorAll("[data-machine]").forEach(inp=>inp.onchange=()=>{data.machines[inp.dataset.machine][inp.dataset.key]=num(inp.value);save();renderMachines();});
}
function renderBenchmarks(){
  el("benchmarksTable").innerHTML=data.benchmarks.map(b=>`<tr><td>${b.name}</td><td>${rupiah(b.a)}</td><td>${rupiah(b.b)}</td><td>${rupiah(b.c)}</td><td>${b.note}</td></tr>`).join("");
}
function openMaterialModal(id){
  const m=id?data.materials.find(x=>x.id===id):{id:"m"+Date.now(),name:"",machine:"indoor",price:0,unit:"meter",note:""};
  pendingSave=m;
  el("modalTitle").textContent=id?"Edit Material":"Tambah Material";
  el("modalBody").innerHTML=`<div class="grid two">
    <label>Nama<input id="mmName" value="${m.name}"></label>
    <label>Mesin<select id="mmMachine">${machineMeta.map(([x,n])=>`<option value="${x}" ${x===m.machine?"selected":""}>${n}</option>`).join("")}</select></label>
    <label>Harga beli<input id="mmPrice" type="number" value="${m.price}"></label>
    <label>Satuan<input id="mmUnit" value="${m.unit}"></label>
    <label style="grid-column:1/-1">Catatan<input id="mmNote" value="${m.note||""}"></label>
  </div>`;
  el("modal").classList.remove("hidden");
}
function editMaterial(id){openMaterialModal(id)}
function deleteMaterial(id){if(confirm("Hapus material ini?")){data.materials=data.materials.filter(x=>x.id!==id);save();renderMaterials();renderDynamicForm()}}
function saveModal(){
  const m={...pendingSave,name:el("mmName").value.trim(),machine:el("mmMachine").value,price:num(el("mmPrice").value),unit:el("mmUnit").value.trim(),note:el("mmNote").value.trim()};
  const idx=data.materials.findIndex(x=>x.id===m.id);
  if(idx>=0)data.materials[idx]=m;else data.materials.push(m);
  save();closeModal();renderMaterials();renderDynamicForm();
}
function closeModal(){el("modal").classList.add("hidden");pendingSave=null}

window.calcIndoor=calcIndoor;window.calcCutting=calcCutting;window.calcLaser=calcLaser;window.calcDocu=calcDocu;window.editMaterial=editMaterial;window.deleteMaterial=deleteMaterial;
init();
