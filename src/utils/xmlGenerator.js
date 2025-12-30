
export const generateFusionXML = (threadStandard, threads) => {
  // threadStandard: { name, unit, angle, sortOrder, threadForm }
  // threads: Array of calculated thread objects

  const header = `<?xml version="1.0" encoding="UTF-8"?>
<ThreadType>
  <Name>${threadStandard.name}</Name>
  <CustomName>${threadStandard.name}</CustomName>
  <Unit>${threadStandard.unit}</Unit>
  <Angle>${threadStandard.angle}</Angle>
  <SortOrder>${threadStandard.sortOrder}</SortOrder>
  <ThreadForm>${threadStandard.threadForm}</ThreadForm>`;

  const isMetric = threadStandard.unit === 'mm';

  const body = threads.map(t => {
    // For BA (metric), we use <Pitch>. For Whitworth (inch), we use <TPI>.
    const pitchElement = isMetric
      ? `<Pitch>${t.basic.p}</Pitch>`
      : `<TPI>${t.tpi}</TPI>`;

    return `
  <ThreadSize>
    <Size>${t.size}</Size>
    <Designation>
      <ThreadDesignation>${t.designation}</ThreadDesignation>
      <CTD>${t.designation}</CTD>
      ${pitchElement}
      <Thread>
        <Gender>external</Gender>
        <Class>Medium</Class>
        <MajorDia>${t.external.major}</MajorDia>
        <PitchDia>${t.external.pitch}</PitchDia>
        <MinorDia>${t.external.minor}</MinorDia>
      </Thread>
      <Thread>
        <Gender>internal</Gender>
        <Class>Medium</Class>
        <MajorDia>${t.internal.major}</MajorDia>
        <PitchDia>${t.internal.pitch}</PitchDia>
        <MinorDia>${t.internal.minor}</MinorDia>
        <TapDrill>${t.internal.tapDrill}</TapDrill>
      </Thread>
    </Designation>
  </ThreadSize>`;
  }).join('');

  const footer = `
</ThreadType>`;

  return header + body + footer;
};
