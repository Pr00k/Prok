// Chart on homepage
const ctx = document.getElementById('visitorsChart')?.getContext('2d');
if (ctx) {
  new Chart(ctx, {
    type: 'bar',
    data: { labels: ['يناير','فبراير','مارس','أبريل'], datasets:[{label:'زوار',data:[30,45,28,60]}] }
  });
}
