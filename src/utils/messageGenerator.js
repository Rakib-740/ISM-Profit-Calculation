import {
  toBengaliDigits,
  formatBengaliNumberWithCommas,
  formatBengaliAmountWords,
  formatInvestorInvestment,
  getBengaliOrdinal,
  roundNumber
} from './bengaliUtils';

/**
 * Calculates profit metrics for a return.
 */
export function calculateReturnMetrics(totalInvestment, totalProfit, passivePercentage) {
  const inv = parseFloat(totalInvestment) || 0;
  const prof = parseFloat(totalProfit) || 0;
  const pct = parseFloat(passivePercentage) || 0;

  const passiveProfit = roundNumber((prof * pct) / 100, 2);
  // totalInvestment is stored in Lacs (e.g. 110 = 110 Lacs = 1,10,00,000 taka)
  const invInLacs = inv;
  const profitPerLakh = invInLacs > 0 ? roundNumber(passiveProfit / invInLacs, 2) : 0;

  return {
    passiveProfit,
    profitPerLakh,
    invInLacs
  };
}

/**
 * Calculates profit for an individual investor.
 * investor.investmentLacs * profitPerLakh
 */
export function calculateInvestorProfit(investmentLacs, profitPerLakh) {
  const lacs = parseFloat(investmentLacs) || 0;
  return roundNumber(lacs * profitPerLakh, 2);
}

/**
 * Generates the full Bengali return message string.
 */
export function generateBengaliMessage(project, activeReturn, investors, nextReturnRange) {
  if (!project || !activeReturn) return '';

  const { passiveProfit, profitPerLakh } = calculateReturnMetrics(
    activeReturn.totalInvestment,
    activeReturn.totalProfit,
    activeReturn.passivePercentage
  );

  // Format project number
  let projNumText = project.projectNumber || '';
  const digitsOnly = projNumText.replace(/\D/g, '');
  if (digitsOnly && !projNumText.includes('আইএসএম প্রজেক্ট')) {
    projNumText = `আইএসএম প্রজেক্ট-${toBengaliDigits(digitsOnly)}`;
  } else {
    projNumText = toBengaliDigits(projNumText);
  }

  // Format return ordinal & date
  const ordinal = getBengaliOrdinal(activeReturn.returnNumber);
  const returnDateBengali = toBengaliDigits(activeReturn.returnDate);

  // Format return financial metrics
  // totalInvestment is in Lacs — multiply by 100,000 to get the taka amount for display
  const totalInvBengali = formatBengaliAmountWords((parseFloat(activeReturn.totalInvestment) || 0) * 100000);
  const totalProfBengali = formatBengaliAmountWords(activeReturn.totalProfit);
  const passivePctBengali = toBengaliDigits(activeReturn.passivePercentage);
  const passiveProfBengali = formatBengaliAmountWords(passiveProfit);
  const profitPerLakhBengali = `${formatBengaliNumberWithCommas(profitPerLakh)} টাকা`;

  // Format duration and returns
  const totalReturnsBengali = toBengaliDigits(project.numberOfReturns);

  // Build investor list section
  const formattedInvestors = (investors || []).map((inv, idx) => {
    const invProfit = calculateInvestorProfit(inv.investmentLacs, profitPerLakh);
    const profitText = `${formatBengaliNumberWithCommas(invProfit)} টাকা`;
    const invLacsText = formatInvestorInvestment(inv.investmentLacs);
    
    // Serial number is English digit e.g. "1.  ABIBSA Shomiti" or "2. ISM-075"
    return `${idx + 1}.  ${inv.name}\n   ইনভেস্টমেন্ট: ${invLacsText}\n   প্রফিট: ${profitText}`;
  }).join('\n\n');

  // Next return range
  const minDays = toBengaliDigits(nextReturnRange.minDays);
  const maxDays = toBengaliDigits(nextReturnRange.maxDays);

  const messageLines = [
    `আসসালামু আলাইকুম,`,
    ``,
    `★ প্রজেক্ট নাম্বার : ${projNumText}`,
    `★ প্রজেক্টের নাম: ${project.projectName || ''}`,
    `★ প্রোডাক্ট: ${project.product || ''}`,
    ``,
    `প্রজেক্ট শুরু: ${toBengaliDigits(project.startDate)} (মেয়াদ: ${project.duration}/ ${totalReturnsBengali} টি রিটার্ন)`,
    `প্রজেক্ট শেষ হবে: ${toBengaliDigits(project.endDate)}`,
    ``,
    `*${ordinal} রিটার্ন: ${returnDateBengali}*`,
    `সময় লেগেছে-  ${toBengaliDigits(activeReturn.daysTaken)} দিন`,
    ``,
    `মোট ইনভেস্টমেন্ট: ${totalInvBengali}`,
    `মোট প্রফিট: ${totalProfBengali}`,
    `নিষ্ক্রিয় পক্ষের মোট লাভ (${passivePctBengali}%): ${passiveProfBengali}`,
    `নিষ্ক্রিয় পক্ষের প্রতি ১ লক্ষ টাকায় প্রফিট: ${profitPerLakhBengali}`,
    ``,
    formattedInvestors,
    ``,
    `*সম্ভাব্য পরবর্তী রিটার্ন: ${minDays}-${maxDays} দিন পর*`
  ];

  return messageLines.join('\n');
}
