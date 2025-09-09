import React, { useState, useEffect } from 'react';

// נתוני עובדים ראשוניים
const initialEmployeesData = [
  { id: '1', name: 'סימה', role: 'employee', status: null },
  { id: '2', name: 'חני', role: 'special', present: true },
  { id: '3', name: 'ליזה', role: 'employee', status: null },
  { id: '4', name: 'שיר', role: 'employee', status: null },
  { id: '5', name: 'הילה', role: 'employee', status: null },
  { id: '6', name: 'דוד', role: 'special', present: true },
  { id: '7', name: 'שרון', role: 'special', present: true },
  { id: '8', name: 'אייל', role: 'special', present: true },
  { id: '9', name: 'יקי', role: 'special', present: true },
];

const days = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי'];
const BASE_URL = 'http://localhost:3000'; // יש לשנות ל-URL של האפליקציה בשרת

// עמוד זמינות חניות
function AvailabilityPage({ employees, setEmployees, releasedEmployee, setReleasedEmployee }) {
  const [hoveredEmp, setHoveredEmp] = useState(null);

  const handleStatusChange = (empId, statusValue) => {
    setEmployees(prev =>
      prev.map(emp => emp.id === empId ? { ...emp, status: statusValue, present: statusValue } : emp)
    );
  };

  const handlePresenceToggle = (empId, isPresent) => {
    setEmployees(prev =>
      prev.map(emp => {
        if (emp.id === empId) {
          if (!isPresent) {
            setReleasedEmployee(emp.name);
          }
          return { ...emp, present: isPresent, status: isPresent };
        }
        return emp;
      })
    );
  };

  return (
    <div dir="rtl" className="container p-4">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-8 mt-6">
        זמינות חניות
      </h2>
      <ul className="space-y-6">
        {employees.map(emp => (
          <li key={emp.id} className="bg-white shadow rounded p-4 text-center">
            <div className="text-xl font-semibold">{emp.name}</div>
            {emp.role === 'special' ? (
              <>
                <button
                  onClick={() => handlePresenceToggle(emp.id, !emp.present)}
                  onMouseEnter={() => setHoveredEmp(emp.id)}
                  onMouseLeave={() => setHoveredEmp(null)}
                  className={`mt-3 w-full py-2 rounded-lg text-white font-semibold transition-colors duration-300 shadow-md 
                    ${(emp.present && hoveredEmp !== emp.id) ? 'bg-red-500 hover:bg-green-500' :
                      (emp.present && hoveredEmp === emp.id) ? 'bg-green-500' :
                        (!emp.present) ? 'bg-green-500' : ''
                    }`}
                >
                  {(emp.present && hoveredEmp !== emp.id) ? 'נמצא – חניה תפוסה' :
                    (emp.present && hoveredEmp === emp.id) ? 'לא נמצא? לחץ ושחרר חניה' :
                      (!emp.present) ? 'החנייה שוחררה' : ''
                  }
                </button>
              </>
            ) : (
              <div className="mt-3 flex justify-center gap-6">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={emp.status === true}
                    onChange={() => handleStatusChange(emp.id, true)}
                    className="form-radio h-5 w-5 text-blue-600 transition-colors duration-200"
                  />
                  <span>כן</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={emp.status === false}
                    onChange={() => handleStatusChange(emp.id, false)}
                    className="form-radio h-5 w-5 text-red-600 transition-colors duration-200"
                  />
                  <span>לא</span>
                </label>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

// עמוד לוז שבועי
function WeeklySchedulePage({ employees }) {
  const [schedule, setSchedule] = useState({});

  return (
    <div dir="rtl" className="p-6">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-8 mt-6">
        לוז שבועי לחניות
      </h2>
      <table className="w-full border-collapse border border-gray-300 text-center rounded-lg overflow-hidden shadow-lg">
        <thead>
          <tr className="bg-gray-100">
            {days.map(day => (
              <th key={day} className="p-3 border-r last:border-r-0">
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {days.map(day => (
              <td key={day} className="p-2 border-r last:border-r-0">
                <select
                  value={schedule[day] || ''}
                  onChange={e =>
                    setSchedule({ ...schedule, [day]: e.target.value })
                  }
                  className="p-2 rounded w-full bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  <option value="">בחר עובד</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name}
                    </option>
                  ))}
                </select>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

// עמוד מפת חניון
function ParkingSketchPage({ employees }) {
  const totalSpots = 10;
  const occupiedEmployees = employees.filter(emp => emp.role === "special" ? emp.present : emp.status === true);
  const occupiedSpotsCount = occupiedEmployees.length;

  const spots = Array.from({ length: totalSpots }, (_, index) => {
    const occupied = index < occupiedSpotsCount;
    const employee = occupied ? occupiedEmployees[index] : null;
    return { occupied, employee };
  });

  return (
    <div dir="rtl" className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">מפת חניון</h2>
      <p className="text-center text-lg text-gray-600 mb-8">
        חניות תפוסות: <span className="font-bold text-red-500">{occupiedSpotsCount}</span> מתוך <span className="font-bold">{totalSpots}</span>
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 justify-items-center">
        {spots.map((spot, index) => (
          <div
            key={index}
            className={`
              w-full h-32 flex flex-col items-center justify-center relative
              rounded-xl shadow-md transition-all duration-300 transform hover:scale-105
              ${spot.occupied ? "bg-red-500 text-white" : "bg-green-500 text-white"}
            `}
          >
            <span className="absolute top-2 right-2 text-sm font-semibold">
              #{index + 1}
            </span>
            {spot.occupied ? (
              <>
                <img src="/carlogo1.png" alt="Parking Icon" className="w-24 h-28" />
                <div className="text-base font-semibold text-center mt-2">{spot.employee.name}</div>
              </>
            ) : (
              <div className="text-base font-semibold">פנוי</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// רכיב לשליחת הודעות וואטסאפ לעובדים מיוחדים
function WhatsappLinkGenerator({ employees, setPage }) {
  const specialEmployees = employees.filter(emp => emp.role === 'special');

  const generateWhatsappLink = (employeeId) => {
    const url = `${BASE_URL}?page=release&id=${employeeId}`;
    const message = `${url}\n\nבוקר טוב! אנא לחץ/י על הקישור כדי לעדכן אם את/ה מגיע/ה היום.`;
    return `whatsapp://send?text=${encodeURIComponent(message)}`;
  };

  return (
    <div dir="rtl" className="p-6">
      <h2 className="text-3xl font-bold text-center mb-6">שליחת תזכורת לוואטסאפ</h2>
      <ul className="space-y-4">
        {specialEmployees.map(emp => (
          <li key={emp.id} className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center">
            <span className="text-lg font-semibold">{emp.name}</span>
            <a
              href={generateWhatsappLink(emp.id)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-green-500 text-white rounded-lg font-semibold transition-colors duration-300 hover:bg-green-600"
            >
              שלח הודעה
            </a>
          </li>
        ))}
      </ul>
      <div className="text-center mt-8">
        <button
          onClick={() => setPage('availability')}
          className="px-6 py-3 rounded-lg bg-blue-500 text-white font-semibold shadow-md transition-transform duration-300 hover:scale-105 hover:bg-blue-600"
        >
          חזור לזמינות חניות
        </button>
      </div>
    </div>
  );
}

// רכיב חדש לשחרור חניה
function SpecialParkingReleaser({ employees, setEmployees, setPage, setReleasedEmployee }) {
  const [message, setMessage] = useState('מעדכן את מצב החניה...');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (id) {
      setEmployees(prev => {
        const updatedEmployees = prev.map(emp => {
          if (emp.id === id) {
            setReleasedEmployee(emp.name);
            return { ...emp, status: false, present: false };
          }
          return emp;
        });
        setMessage('החניה שלך שוחררה בהצלחה!');
        return updatedEmployees;
      });
    } else {
      setMessage('שגיאה: חסר מזהה עובד.');
    }

    // Clean the URL and redirect after a short delay
    const timer = setTimeout(() => {
      window.history.pushState({}, document.title, window.location.pathname);
      setPage('availability'); // Redirect to availability page to show the message
    }, 3000);

    return () => clearTimeout(timer);
  }, [setEmployees, setPage, setReleasedEmployee]);

  return (
    <div dir="rtl" className="flex flex-col items-center justify-center p-6 text-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">{message}</h2>
      <div className="text-lg text-gray-600">
        הנך מופנה/ת לעמוד זמינות חניות...
      </div>
    </div>
  );
}

// האפליקציה הראשית
export default function App() {
  const [page, setPage] = useState('availability');
  const [employees, setEmployees] = useState(initialEmployeesData);
  const [releasedEmployee, setReleasedEmployee] = useState(null);

  // בדיקת פרמטרים ב-URL כשהאפליקציה נטענת
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pageParam = params.get('page');
    const id = params.get('id');

    if (pageParam === 'release' && id) {
      setPage('release');
    }
  }, []);

  // הערה: userId הוא ערך מדומה לצורך הדוגמה הזו
  const userId = '1';

  return (
    <div dir="rtl" className="bg-gray-100 min-h-screen font-sans">
      <nav className="bg-white shadow p-4 flex justify-center gap-6 mb-10">
        <button
          onClick={() => setPage('availability')}
          className="px-6 py-3 rounded-lg bg-blue-500 text-white font-semibold shadow-md transition-transform duration-300 hover:scale-105 hover:bg-blue-600"
        >
          זמינות חניות
        </button>
        <button
          onClick={() => setPage('schedule')}
          className="px-6 py-3 rounded-lg bg-blue-500 text-white font-semibold shadow-md transition-transform duration-300 hover:scale-105 hover:bg-blue-600"
        >
          לוז שבועי
        </button>
        <button
          onClick={() => setPage('parkingSketch')}
          className="px-6 py-3 rounded-lg bg-blue-500 text-white font-semibold shadow-md transition-transform duration-300 hover:scale-105 hover:bg-blue-600"
        >
          מפת חניון
        </button>
        <button
          onClick={() => setPage('whatsapp')}
          className="px-6 py-3 rounded-lg bg-green-500 text-white font-semibold shadow-md transition-transform duration-300 hover:scale-105 hover:bg-green-600"
        >
          שלח הודעת וואטסאפ
        </button>
      </nav>

      <div className="w-full max-w-6xl mx-auto px-4">
        {page === 'availability' && (
          <AvailabilityPage
            employees={employees}
            setEmployees={setEmployees}
            userId={userId}
            releasedEmployee={releasedEmployee}
            setReleasedEmployee={setReleasedEmployee}
          />
        )}
        {page === 'schedule' && <WeeklySchedulePage employees={employees} />}
        {page === 'parkingSketch' && (
          <ParkingSketchPage employees={employees} />
        )}
        {page === 'whatsapp' && (
          <WhatsappLinkGenerator
            employees={employees}
            setPage={setPage}
          />
        )}
        {page === 'release' && (
          <SpecialParkingReleaser
            employees={employees}
            setEmployees={setEmployees}
            setPage={setPage}
            setReleasedEmployee={setReleasedEmployee}
          />
        )}
      </div>
    </div>
  );
}
