const Company = require('../models/CompanyModel.js');
const qrCode = require('qr-image');
const fs = require('fs');
const path = require('path');
const htmlPDF = require('html-pdf');
const handlebars = require('handlebars');
//const amazonConfig = require('../config/amazonConfig.js');

module.exports = (companyID) => {
	logger.debug('[generateTags]', 'Parametros', companyID);
    return new Promise((accept, reject) => {
        const qrCodePath = path.join(__dirname, '../../../var/www/html/pngs/' + companyID + '.png');
        const code = qrCode.image("http://app.cardapio01.com.br/" + companyID, {
            type: 'png',
            size: 10,
            margin: 0
        });

        const output = fs.createWriteStream(qrCodePath);
        code.pipe(output);

        logger.debug('[Generate Tags] ', 'qrCodePath', qrCodePath);

        const templatePath = path.join(__dirname, '../QRCodeTag/pdfTemplates/tagsQRCode.html');
        const templateHTML = fs.readFileSync(templatePath, 'utf8');
        const template = handlebars.compile(templateHTML); //Compila o template HTML usando Handlebars
        logger.debug('[Generate Tags] ', 'templatePath', templatePath);

        const tagImagesPath = path.join(__dirname, '../QRCodeTag/images/cardapio01-tags.jpg');
        const data = {
            qrCode: qrCodePath,
            infoImage: tagImagesPath
        };
        const htmlResult = template(data); //Adiciona os dados necessários no template
        logger.debug('[Generate Tags] ', 'tagImagesData', data);



        //Array do opçõs para geração do PDF
        const options = {
            "format": 'A4',
            "base": "file://" //Define o caminho base para busca dos arquivos
        };

        htmlPDF.create(htmlResult, options).toBuffer((err, generatedPdf) => {
            if (err) logger.error('[Generate Tags]', 'Erro ao gerar aquivo de tags', err);

            const qrPdfCodePath = path.join(__dirname, '../../../var/www/html/tags/' + companyID + '.pdf');
            const output = fs.createWriteStream(qrPdfCodePath);
            output.write(generatedPdf);

        });
    });
};
