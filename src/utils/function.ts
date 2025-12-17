
enum DayOfWeek {
  Sunday = 0,
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6
}

function getMondayBeforeDate(date: Date): Date {
  const resultDate: Date = new Date(date);
  const dayOfWeek: DayOfWeek = resultDate.getDay() as DayOfWeek;
  
  switch (dayOfWeek) {
    case DayOfWeek.Sunday:
      // Dimanche → ajouter 1 jour pour aller à lundi
      resultDate.setDate(resultDate.getDate() + 1);
      break;
      
    case DayOfWeek.Saturday:
      // Samedi → ajouter 2 jours pour aller à lundi
      resultDate.setDate(resultDate.getDate() + 2);
      break;
      
    case DayOfWeek.Monday:
      // Déjà lundi → ne rien faire
      break;
      
    default:
      // Mardi à vendredi → revenir au lundi précédent
      const daysToSubtract: number = dayOfWeek - DayOfWeek.Monday;
      resultDate.setDate(resultDate.getDate() - daysToSubtract);
      break;
  }
  
  return resultDate;
}

export { getMondayBeforeDate, DayOfWeek };