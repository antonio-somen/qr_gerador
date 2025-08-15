const tipos = {
  wifi: {
    nome: "Wi-Fi",
    icone: "📶",
    cor: "#000000",
    corTema: "#fce883",
    campos: [
      { id: "ssid", label: "Nome da Rede (SSID)", type: "text", required: true },
      { id: "senha", label: "Senha", type: "text", required: true },
      { id: "seguranca", label: "Tipo de Segurança", type: "select", options: [
        {value:"WPA", text:"WPA/WPA2"}, {value:"WEP", text:"WEP"}, {value:"nopass", text:"Nenhuma"}
      ], required: true }
    ]
  },
  whatsapp: {
    nome: "WhatsApp",
    icone: "💬",
    cor: "#000000",
    corTema: "#25D366",
    campos: [
      { id: "numero", label: "Número com DDD", type: "text", required: true },
      { id: "mensagem", label: "Mensagem (opcional)", type: "text", required: false }
    ]
  },
  link: {
    nome: "Link",
    icone: "🔗",
    cor: "#000000",
    corTema: "#1976d2",
    campos: [
      { id: "url", label: "URL ou link completo", type: "url", required: true }
    ]
  },
  livre: {
    nome: "Livre",
    icone: "✏️",
    cor: "#000000",
    corTema: "#616161",
    campos: [
      { id: "conteudo", label: "Conteúdo Livre", type: "text", required: true }
    ]
  }
};

let tipoAtual = "wifi";

const opcoes = document.querySelectorAll(".opcao");
const iconeForm = document.getElementById("icone-form");
const camposDinamicos = document.getElementById("campos-dinamicos");
const formulario = document.getElementById("formulario");
const resultado = document.getElementById("resultado");
const visual = document.getElementById("visual");
const downloadPNG = document.getElementById("download-png");
const downloadPDF = document.getElementById("download-pdf");
const compartilharBtn = document.getElementById("compartilhar");
const campoTitulo = document.getElementById("titulo");
const campoDescricao = document.getElementById("descricao");

function renderCampos(tipo) {
  camposDinamicos.innerHTML = "";
  tipos[tipo].campos.forEach(campo => {
    const label = document.createElement("label");
    label.textContent = campo.label;
    let input;
    if (campo.type === "select") {
      input = document.createElement("select");
      input.id = campo.id;
      input.required = campo.required;
      campo.options.forEach(opt => {
        const o = document.createElement("option");
        o.value = opt.value;
        o.text = opt.text;
        input.appendChild(o);
      });
    } else {
      input = document.createElement("input");
      input.type = campo.type;
      input.id = campo.id;
      input.required = campo.required;
      if(campo.type==="url") input.pattern = "https?://.+";
    }
    camposDinamicos.appendChild(label);
    camposDinamicos.appendChild(input);
  });
  iconeForm.textContent = tipos[tipo].icone;
}
opcoes.forEach(btn => {
  btn.addEventListener("click", () => {
    opcoes.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    tipoAtual = btn.dataset.tipo;
    renderCampos(tipoAtual);
    resultado.style.display = "none";
    campoTitulo.value = "";
    campoDescricao.value = "";
  });
});
renderCampos(tipoAtual);

function gerarWiFiQR(data) {
  let t = data.seguranca === "nopass" ? "nopass" : data.seguranca;
  let s = data.ssid || "";
  let p = data.seguranca === "nopass" ? "" : data.senha || "";
  return `WIFI:T:${t};S:${s};P:${p};;`;
}

function gerarWhatsAppQR(data) {
  let num = data.numero.replace(/[^0-9]/g,"");
  let msg = data.mensagem ? encodeURIComponent(data.mensagem) : "";
  return `https://wa.me/${num}` + (msg ? `?text=${msg}` : "");
}

function gerarLinkQR(data) {
  return data.url;
}

function gerarLivreQR(data) {
  return data.conteudo;
}

formulario.onsubmit = function(e){
  e.preventDefault();
  resultado.style.display = "none";
  visual.innerHTML = "";
  let data = {};
  tipos[tipoAtual].campos.forEach(campo => {
    data[campo.id] = (document.getElementById(campo.id) || {}).value || "";
  });

  let conteudoQR = "";
  if(tipoAtual==="wifi") conteudoQR = gerarWiFiQR(data);
  else if(tipoAtual==="whatsapp") conteudoQR = gerarWhatsAppQR(data);
  else if(tipoAtual==="link") conteudoQR = gerarLinkQR(data);
  else if(tipoAtual==="livre") conteudoQR = gerarLivreQR(data);

  if (!conteudoQR) {
    alert("Preencha os campos corretamente para gerar o QR Code.");
    return;
  }

  let cor = tipos[tipoAtual].cor;
  let corTema = tipos[tipoAtual].corTema;
  let titulo = campoTitulo.value.trim();
  let desc = campoDescricao.value.trim();

  if (tipoAtual === 'livre') {
    visual.innerHTML = `
      <div class="qr-card-simples">
        <div class="qr-area" id="qr-area"></div>
        ${titulo ? `<h3 class="qr-titulo-simples">${titulo}</h3>` : ""}
        ${desc ? `<p class="qr-descricao-simples">${desc}</p>` : ""}
      </div>
    `;
    let qrArea = document.getElementById("qr-area");
    qrArea.innerHTML = "";
    new QRCode(qrArea, {
      text: conteudoQR,
      width: 220,
      height: 220,
      colorDark: cor,
      colorLight: "#fff",
      correctLevel: QRCode.CorrectLevel.H
    });
  } else {
    let infoTipo = "";
    let infoAdicional = "";
    let icon = tipos[tipoAtual].icone;

    if (tipoAtual === 'wifi') {
      infoTipo = 'Conecte-se ao Wi-Fi';
      infoAdicional = `Rede: ${data.ssid}`;
    } else if (tipoAtual === 'whatsapp') {
      infoTipo = 'Converse no WhatsApp';
      infoAdicional = `Número: ${data.numero}`;
    } else if (tipoAtual === 'link') {
      infoTipo = 'Acesse o Link';
      infoAdicional = `URL: ${data.url}`;
    }

    visual.innerHTML = `
      <div class="qr-card qr-card-${tipoAtual}">
        <div class="qr-header-info">
          ${icon} ${titulo || infoTipo}
        </div>
        <div class="qr-area qr-border-${tipoAtual}" id="qr-area"></div>
        <div class="qr-info-bottom">
          <h4>${infoTipo}</h4>
          <p>${infoAdicional}</p>
          ${desc ? `<p class="qr-descricao">${desc}</p>` : ""}
        </div>
      </div>
    `;
    let qrArea = document.getElementById("qr-area");
    qrArea.innerHTML = "";
    new QRCode(qrArea, {
      text: conteudoQR,
      width: 220,
      height: 220,
      colorDark: cor,
      colorLight: "#fff",
      correctLevel: QRCode.CorrectLevel.H
    });
  }
  
  resultado.style.display = "flex";
  compartilharBtn.style.display = (navigator.share ? "inline-block" : "none");
};

downloadPNG.onclick = function() {
  html2canvas(visual, {backgroundColor: null, scale: 3}).then(canvas => {
    let link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'qrcode.png';
    link.click();
  });
};

downloadPDF.onclick = function() {
  html2canvas(visual, {backgroundColor: "#fff", scale:3}).then(canvas => {
    const imgData = canvas.toDataURL('image/png');
    const pdf = new window.jspdf.jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });
    const pageWidth = pdf.internal.pageSize.getWidth();
    let imgWidth = Math.min(pageWidth-40, 150);
    let imgHeight = canvas.height * imgWidth / canvas.width;
    pdf.addImage(imgData, 'PNG', (pageWidth-imgWidth)/2, 40, imgWidth, imgHeight);
    pdf.save('qrcode.pdf');
  });
};

compartilharBtn.onclick = async function() {
  html2canvas(visual, {backgroundColor: null, scale: 2}).then(canvas => {
    canvas.toBlob(blob => {
      const file = new File([blob], "qrcode.png", {type:"image/png"});
      navigator.share({
        files: [file],
        title: "QR Code",
        text: "Veja este QR Code!"
      });
    },"image/png");
  });
};