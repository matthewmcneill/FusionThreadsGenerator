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

  // 3. Group threads by nominal size
  const groupedThreads = threads.reduce((acc, thread) => {
    const size = thread.size.toString();
    if (!acc[size]) acc[size] = [];
    acc[size].push(thread);
    return acc;
  }, {});

  // 4. Generate each <ThreadSize> block
  const body = Object.entries(groupedThreads).map(([size, sizeThreads]) => {
    const designations = sizeThreads.map(t => {
      const pitchElement = isMetric
        ? `<Pitch>${t.basic.p}</Pitch>`
        : `<TPI>${t.tpi}</TPI>`;

      // Generate <Thread> blocks for both internal and external genders
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

      return `
      <Designation>
        <ThreadDesignation>${t.designation}</ThreadDesignation>
        <CTD>${t.ctd || t.designation}</CTD>
        ${pitchElement}
        ${threadBlocks}
      </Designation>`;
    }).join('');

    return `
    <ThreadSize>
      <Size>${size}</Size>
      ${designations}
    </ThreadSize>`;
  }).join('');

  // 5. Append the closing tag and return the complete document
  const footer = `
</ThreadType>`;

  return header + body + footer;
};
