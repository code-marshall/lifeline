import React, { useState, useEffect } from 'react';
import { differenceInWeeks, differenceInYears, parseISO, isValid } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Calendar, Clock, Heart, AlertTriangle } from 'lucide-react';
import './App.css';

function App() {
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [expectedYears, setExpectedYears] = useState(75);
  const [lifeData, setLifeData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  const calculateLifeData = () => {
    if (!dateOfBirth) return;

    const birthDate = parseISO(dateOfBirth);
    if (!isValid(birthDate)) return;

    const today = new Date();
    const expectedDeathDate = new Date(birthDate);
    expectedDeathDate.setFullYear(birthDate.getFullYear() + expectedYears);

    // Calculate weeks
    const totalWeeks = expectedYears * 52;
    const weeksLived = differenceInWeeks(today, birthDate);
    const weeksRemaining = Math.max(0, totalWeeks - weeksLived);
    const currentAge = differenceInYears(today, birthDate);

    // Calculate hours
    const totalHours = expectedYears * 365 * 24;
    const hoursLived = weeksLived * 7 * 24;
    const hoursRemaining = Math.max(0, totalHours - hoursLived);

    // Hours breakdown (remaining hours)
    const sleepHours = hoursRemaining * 0.33; // 8 hours sleep per day
    const workHours = hoursRemaining * 0.33; // 8 hours work per day (assuming working years)
    const choresHours = hoursRemaining * 0.125; // 3 hours chores per day
    const freeHours = hoursRemaining - sleepHours - workHours - choresHours;

    setLifeData({
      totalWeeks,
      weeksLived,
      weeksRemaining,
      currentAge,
      percentageLived: (weeksLived / totalWeeks) * 100,
      totalHours,
      hoursLived,
      hoursRemaining,
      sleepHours,
      workHours,
      choresHours,
      freeHours,
    });
  };

  const handleCalculate = () => {
    calculateLifeData();
  };

  const weekData = lifeData ? [
    {
      name: 'Weeks Lived',
      value: lifeData.weeksLived,
      fill: '#ef4444'
    },
    {
      name: 'Weeks Remaining',
      value: lifeData.weeksRemaining,
      fill: '#22c55e'
    }
  ] : [];

  const hourData = lifeData ? [
    {
      name: 'Sleep',
      value: Math.round(lifeData.sleepHours),
      fill: '#3b82f6'
    },
    {
      name: 'Work',
      value: Math.round(lifeData.workHours),
      fill: '#f59e0b'
    },
    {
      name: 'Chores',
      value: Math.round(lifeData.choresHours),
      fill: '#ef4444'
    },
    {
      name: 'Free Time',
      value: Math.round(lifeData.freeHours),
      fill: '#22c55e'
    }
  ] : [];

  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(Math.round(num));
  };

  const WeekVisualization = () => {
    if (!lifeData) return null;

    const weeks = [];
    const weeksPerRow = 52; // 52 weeks per year

    for (let i = 0; i < lifeData.totalWeeks; i++) {
      const isLived = i < lifeData.weeksLived;
      const year = Math.floor(i / weeksPerRow);
      const weekInYear = i % weeksPerRow;

      weeks.push(
        <div
          key={i}
          className={`week-dot ${isLived ? 'lived' : 'remaining'}`}
          title={`Year ${year + 1}, Week ${weekInYear + 1} ${isLived ? '(Lived)' : '(Remaining)'}`}
        />
      );
    }

    return (
      <div className="week-visualization">
        <div className="week-grid">
          {weeks}
        </div>
        <div className="week-legend">
          <div className="legend-item">
            <div className="week-dot lived small"></div>
            <span>Weeks Lived ({formatNumber(lifeData.weeksLived)})</span>
          </div>
          <div className="legend-item">
            <div className="week-dot remaining small"></div>
            <span>Weeks Remaining ({formatNumber(lifeData.weeksRemaining)})</span>
          </div>
        </div>
        <div className="week-info">
          <p>Each dot represents one week of your life. There are 52 weeks per year.</p>
          <p>This visualization helps you see your entire life at a glance!</p>
        </div>
      </div>
    );
  };

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <Heart className="header-icon" />
          <h1>Life Timeline Visualizer</h1>
          <p>Visualize your life in weeks and hours</p>
        </header>

        <div className="input-section">
          <div className="input-group">
            <label htmlFor="dob">
              <Calendar size={20} />
              Date of Birth
            </label>
            <input
              id="dob"
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="input-group">
            <label htmlFor="years">
              <Clock size={20} />
              Expected Lifespan (years)
            </label>
            <input
              id="years"
              type="number"
              value={expectedYears}
              onChange={(e) => setExpectedYears(parseInt(e.target.value) || 75)}
              min="1"
              max="150"
            />
          </div>
        </div>

        <div className="calculate-section">
          <button
            className="calculate-btn"
            onClick={handleCalculate}
            disabled={!dateOfBirth}
          >
            Calculate My Life Timeline
          </button>
        </div>

        {lifeData && (
          <>
            <div className="tabs-container">
              <div className="tabs">
                <button
                  className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
                  onClick={() => setActiveTab('overview')}
                >
                  📊 Overview
                </button>
                <button
                  className={`tab ${activeTab === 'weeks' ? 'active' : ''}`}
                  onClick={() => setActiveTab('weeks')}
                >
                  🔵 Life in Weeks
                </button>
              </div>
            </div>

            {activeTab === 'overview' && (
              <>
                <div className="stats-grid">
                  <div className="stat-card">
                    <h3>Current Age</h3>
                    <p className="stat-number">{lifeData.currentAge}</p>
                    <span>years old</span>
                  </div>

                  <div className="stat-card">
                    <h3>Life Progress</h3>
                    <p className="stat-number">{lifeData.percentageLived.toFixed(1)}%</p>
                    <span>completed</span>
                  </div>

                  <div className="stat-card">
                    <h3>Weeks Lived</h3>
                    <p className="stat-number">{formatNumber(lifeData.weeksLived)}</p>
                    <span>out of {formatNumber(lifeData.totalWeeks)}</span>
                  </div>

                  <div className="stat-card">
                    <h3>Weeks Remaining</h3>
                    <p className="stat-number">{formatNumber(lifeData.weeksRemaining)}</p>
                    <span>left to live</span>
                  </div>
                </div>

                <div className="charts-section">
                  <div className="chart-container">
                    <h3>Life Timeline (Weeks)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={weekData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => formatNumber(value)} />
                        <Legend />
                        <Bar dataKey="value" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="chart-container">
                    <h3>Remaining Hours Breakdown</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={hourData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {hourData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => formatNumber(value) + ' hours'} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="hours-breakdown">
                  <h3>Detailed Hours Breakdown (Remaining Life)</h3>
                  <div className="hours-grid">
                    <div className="hour-card sleep">
                      <h4>Sleep</h4>
                      <p>{formatNumber(lifeData.sleepHours)} hours</p>
                      <span>~8 hours per day</span>
                    </div>

                    <div className="hour-card work">
                      <h4>Work</h4>
                      <p>{formatNumber(lifeData.workHours)} hours</p>
                      <span>~8 hours per day</span>
                    </div>

                    <div className="hour-card chores">
                      <h4>Chores & Duties</h4>
                      <p>{formatNumber(lifeData.choresHours)} hours</p>
                      <span>~3 hours per day</span>
                    </div>

                    <div className="hour-card free">
                      <h4>Free Time</h4>
                      <p>{formatNumber(lifeData.freeHours)} hours</p>
                      <span>Your precious time!</span>
                    </div>
                  </div>
                </div>

                <div className="motivation-section">
                  <AlertTriangle className="warning-icon" />
                  <h3>Make Every Week Count!</h3>
                  <p>
                    You have approximately <strong>{formatNumber(lifeData.weeksRemaining)} weeks</strong> and{' '}
                    <strong>{formatNumber(lifeData.freeHours)} hours of free time</strong> remaining.
                    Use them wisely!
                  </p>
                </div>
              </>
            )}

            {activeTab === 'weeks' && <WeekVisualization />}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
