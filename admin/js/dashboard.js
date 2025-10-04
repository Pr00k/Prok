// Demo dashboard data (تجريبي)
const ctx = document.getElementById('adminChart').getContext('2d');
new Chart(ctx, {
  type: 'line',
  data: {
    labels: ['أحد','اثنين','ثلاثاء','أربعاء','خميس','جمعة','سبت'],
    datasets: [{ label: 'زوار', data: [12,22,18,30,25,40,35], fill:false }]
  }
});
const notes = document.getElementById('notes');
['مرحبًا بك في لوحة الإدارة','تأكد من إخفاء مفاتيح API في .env'].forEach(n=>{
  const li = document.createElement('li'); li.textContent = n; notes.appendChild(li);
});
