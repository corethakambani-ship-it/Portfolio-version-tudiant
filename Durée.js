        document.addEventListener('DOMContentLoaded', function () {
            const cycleForm = document.querySelector('.cycle-form');

            if (!cycleForm) {
                return;
            }

            cycleForm.addEventListener('submit', function (event) {
                event.preventDefault();
                const dernierePeriode = document.querySelector('.derniere-periode').value;
                const duree = document.querySelector('.duree').value;
                const dernierJour = document.querySelector('.dernier-jour').value;

                if (!dernierePeriode) {
                    alert('Veuillez saisir la date du premier jour de vos dernières règles.');
                    return;
                }

                const params = new URLSearchParams({
                    dernierePeriode: dernierePeriode,
                    duree: duree,
                    dernierJour: dernierJour
                });

                window.location.href = 'Menstrual%20cycle.html?' + params.toString();
            });
        });
