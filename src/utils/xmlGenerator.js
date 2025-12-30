/**
 * @module xmlGenerator
 * @description Generates Fusion 360 compatible XML files for thread definitions.
 * 
 * Main functions:
 * - generateFusionXML (exported): Entry point for creating the XML string from thread data.
 */

/**
 * Generates the full XML string for a thread standard.
 * 
 * @param {Object} threadStandard - Metadata about the standard (name, unit, angle, etc.).
 * @param {Array<Object>} threads - Array of calculated thread size objects.
 * @param {Array<string>} selectedClasses - List of class names to include in the output.
 * @returns {string} The formatted XML content.
 */
export const generateFusionXML = (threadStandard, threads, selectedClasses) => {
  // 1. Construct the XML Header with standard metadata
  const header = `<?xml version="1.0" encoding="UTF-8"?>
<ThreadType>
  <Name>${threadStandard.name}</Name>
  <CustomName>${threadStandard.name}</CustomName>
  <Unit>${threadStandard.unit}</Unit>
  <Angle>${threadStandard.angle}</Angle>
  <SortOrder>${threadStandard.sortOrder}</SortOrder>
  <ThreadForm>${threadStandard.threadForm}</ThreadForm>`;

  // 2. Determine if we use Pitch (Metric) or TPI (Imperial)
  const isMetric = threadStandard.unit === 'mm';

  // 3. Generate each <ThreadSize> block
  const body = threads.map(t => {
    const pitchElement = isMetric
      ? `<Pitch>${t.basic.p}</Pitch>`
      : `<TPI>${t.tpi}</TPI>`;

    // 4. For each size, generate <Thread> blocks for both internal and external genders
    // Includes <ThreadToleranceClass> for enhanced CAD compatibility
    const threadBlocks = selectedClasses
      .filter(className => t.classes[className])
      .map(className => {
        const c = t.classes[className];
        return `
      <Thread>
        <Gender>external</Gender>
        <Class>${className}</Class>
        <ThreadToleranceClass>${className}</ThreadToleranceClass>
        <MajorDia>${c.external.major}</MajorDia>
        <PitchDia>${c.external.pitch}</PitchDia>
        <MinorDia>${c.external.minor}</MinorDia>
      </Thread>
      <Thread>
        <Gender>internal</Gender>
        <Class>${className}</Class>
        <ThreadToleranceClass>${className}</ThreadToleranceClass>
        <MajorDia>${c.internal.major}</MajorDia>
        <PitchDia>${c.internal.pitch}</PitchDia>
        <MinorDia>${c.internal.minor}</MinorDia>
        <TapDrill>${c.internal.tapDrill}</TapDrill>
      </Thread>`;
      }).join('');

    // 5. Build the encapsulation for the specific size
    return `
  <ThreadSize>
    <Size>${t.size}</Size>
    <Designation>
      <ThreadDesignation>${t.designation}</ThreadDesignation>
      <CTD>${t.ctd || t.designation}</CTD>
      ${pitchElement}
      ${threadBlocks}
    </Designation>
  </ThreadSize>`;
  }).join('');

  // 6. Append the closing tag and return the complete document
  const footer = `
</ThreadType>`;

  return header + body + footer;
};
