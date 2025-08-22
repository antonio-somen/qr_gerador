// A sua lógica para gerar o conteúdo do QR Code deve ir aqui.
// Por exemplo, pegando dados de um formulário ou string de texto.
const conteudoParaQRCode = "https://www.example.com"; // Substitua por sua lógica real.

// 1. Gerar o QR Code e exibi-lo
const qrCodeImg = document.getElementById('qr-code-img');
const qrCode = new QRious({
    element: qrCodeImg,
    value: conteudoParaQRCode,
    size: 250 // Tamanho do QR Code em pixels
});

// 2. Gerar o PDF de forma otimizada para ocupar a folha
// Certifique-se de que a biblioteca jsPDF esteja incluída no seu HTML.
// Ex: <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>

function gerarPDFCompleto() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 10;

    // Converte a imagem do QR Code para um Data URL para o PDF
    const qrCodeDataURL = qrCodeImg.src;

    // Dimensões do QR Code no PDF
    const qrCodeWidth = 150; // Dimensões fixas para ocupar a maior parte da largura
    const qrCodeHeight = 150;
    const qrCodeX = (pageWidth - qrCodeWidth) / 2;
    const qrCodeY = (pageHeight - qrCodeHeight) / 2; // Centralizado verticalmente

    // Adiciona o título no topo
    doc.setFontSize(28);
    doc.text('Pague com PIX', pageWidth / 2, 20, { align: 'center' });

    // Adiciona o texto de instrução
    doc.setFontSize(14);
    doc.text('Aponte sua câmera para o QR Code abaixo:', pageWidth / 2, 35, { align: 'center' });

    // Adiciona a imagem do QR Code
    doc.addImage(qrCodeDataURL, 'PNG', qrCodeX, qrCodeY, qrCodeWidth, qrCodeHeight);

    // Salva o PDF
    doc.save('pagamento-pix.pdf');
}

// Para usar a função, você pode atrelá-la a um botão no seu HTML
// Por exemplo: <button onclick="gerarPDFCompleto()">Gerar PDF</button>