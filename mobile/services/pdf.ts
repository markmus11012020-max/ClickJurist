import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { ConsultationResponse } from '@clickjurist/shared';

/** HTML-шаблон анонимного PDF (раздел 7 ТЗ) */
function buildDocumentHtml(response: ConsultationResponse): string {
  const docType = response.document_data.document_type || 'Заявление';
  const amount = response.document_data.extracted_fields.amount;
  const date = response.document_data.extracted_fields.date;

  return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Times New Roman', serif; font-size: 14pt; line-height: 1.6; margin: 40px; color: #000; }
    .header { text-align: right; margin-bottom: 40px; }
    .header small { color: #666; font-size: 10pt; }
    h1 { text-align: center; font-size: 16pt; margin: 30px 0; }
    .blank { border-bottom: 1px solid #000; display: inline-block; min-width: 200px; }
    .footer { margin-top: 60px; }
    .plan { margin: 20px 0; padding-left: 20px; }
    .plan li { margin-bottom: 8px; }
  </style>
</head>
<body>
  <div class="header">
    <b>Мировому судье судебного участка № _______</b><br>
    <small>(укажите номер участка и город)</small><br><br>
    <b>Заявитель: _____________________________________</b><br>
    <small>(впишите ваши ФИО полностью ручкой)</small><br><br>
    <b>Адрес проживания: _______________________________</b><br>
    <b>Взыскатель/Организация: __________________________</b>
  </div>

  <h1>${docType}</h1>

  <p>
    Прошу рассмотреть моё обращение по следующему вопросу.
    ${amount ? `Сумма требования: _______ руб. (ориентир: ${amount})` : 'Сумма: _______ руб.'}
    ${date ? `Дата события: _______ (ориентир: ${date})` : ''}
  </p>

  <p><b>Суть обращения:</b></p>
  <p>_________________________________________________________________</p>
  <p>_________________________________________________________________</p>
  <p>_________________________________________________________________</p>

  ${response.step_by_step_plan.length > 0 ? `
  <p><b>Рекомендуемые действия (справочно):</b></p>
  <ol class="plan">
    ${response.step_by_step_plan.map((s) => `<li>${s}</li>`).join('')}
  </ol>
  ` : ''}

  <div class="footer">
    <p>Дата: «___» __________ 20___ г.</p>
    <p>Подпись: ___________________</p>
  </div>

  <p style="font-size: 9pt; color: #999; margin-top: 40px; text-align: center;">
  Сформировано CLICK JURIST — анонимный юридический помощник. Персональные данные не сохраняются.
  </p>
</body>
</html>`;
}

export async function exportPdf(response: ConsultationResponse): Promise<void> {
  const html = buildDocumentHtml(response);
  const { uri } = await Print.printToFileAsync({ html, base64: false });

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(uri, {
      mimeType: 'application/pdf',
      dialogTitle: 'Сохранить анонимный бланк',
      UTI: 'com.adobe.pdf',
    });
  }
}
