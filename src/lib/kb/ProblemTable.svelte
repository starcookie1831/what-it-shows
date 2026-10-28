<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import { causeOf, uniqueById, type Cause, type Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';

  let { ticket }: { ticket: number } = $props();

  type Problem = Cause | 'one-day' | 'unplaced';
  const ORDER: readonly Problem[] = ['parser', 'hint', 'one-day', 'unplaced'];

  const groups = $derived.by(() => {
    const oneDay = new Set(notes.oneDayMove);
    const merged = uniqueById(reports as Report[]).filter((r) => r.mergedInto === ticket);
    const by = new Map<Problem, Report[]>();
    for (const r of merged) {
      const problem: Problem = oneDay.has(r.id) ? 'one-day' : (causeOf(r, tenantOf(r)) ?? 'unplaced');
      by.set(problem, [...(by.get(problem) ?? []), r]);
    }
    return ORDER.flatMap((problem) => {
      const rs = by.get(problem);
      if (!rs?.length) return [];
      const days = rs.map((r) => r.receivedAt.slice(0, 10)).sort();
      return [
        {
          problem,
          reports: rs.length,
          tenants: new Set(rs.map((r) => r.tenant)).size,
          firstSeen: days[0],
          lastSeen: days[days.length - 1],
        },
      ];
    });
  });

  const total = $derived(groups.reduce((n, g) => n + g.reports, 0));
</script>

<p class="sum">
  <strong>{total}</strong> reports in #{ticket} ·
  <strong>{groups.length}</strong>
  {groups.length === 1 ? 'problem' : 'problems'}
</p>

<table>
  <thead>
    <tr><th>problem</th><th>reports</th><th>tenants</th><th>seen</th></tr>
  </thead>
  <tbody>
    {#each groups as g (g.problem)}
      <tr>
        <td><code>{g.problem}</code></td>
        <td>{g.reports}</td>
        <td>{g.tenants}</td>
        <td>{g.firstSeen} → {g.lastSeen}</td>
      </tr>
    {/each}
  </tbody>
</table>

<style>
  .sum { font-size: 1.1rem; }
</style>
