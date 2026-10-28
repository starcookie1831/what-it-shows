<script lang="ts">
  import Runbook from '#lib/layouts/runbook.svelte';
  import ProblemTable from '#lib/kb/ProblemTable.svelte';
  import RenderStamp from '#lib/kb/RenderStamp.svelte';

  const signature = 'Song Lee';
</script>

<Runbook
  title="#4471 splits into three problems"
  owner="Song Lee"
  status="draft"
  reviewed="2026-10-28"
>
  <p>
    #4471 holds every date report the desk merged, and the incident page calls that one known parser
    bug. The reports are three problems. Each one needs its own ticket. The counts below are computed
    from the export.
  </p>

  <h2>Parser</h2>
  <p>
    Day-first tenants send dates day first. The shared parser reads the month first, so 7 April lands
    on 4 July. This is the app, email, and booking-v2 reports. The desk's table keeps the one-day reports
    inside this count.
  </p>

  <h2>Hint</h2>
  <p>
    booking-v3 prints <code>MM/DD/YYYY</code> under the date field. People type the month first, as the
    hint says. The form then reads the day first, the tenant's way. Same swapped day, different code.
  </p>

  <h2>One day</h2>
  <p>
    Five reports move a booking by a day. 12 May (Tuesday)
    shows as 11 May (Monday). 6 October (Tuesday) shows as Monday. Every June booking is a day off,
    and other months are not. A client in Lisbon gets Tuesday and a client in Toronto gets Monday for
    the same meeting. One invite arrives before the booking was made.
  </p>

  <ProblemTable ticket={4471} />
  <RenderStamp {signature} />
</Runbook>
