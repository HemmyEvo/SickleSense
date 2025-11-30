// app/profile/page.tsx
'use client';

import { 
  User, 
  Mail, 
  Phone, 
  MapPin,
  Calendar,
  Shield,
  Bell,
  Users,
  Stethoscope,
  Edit3,
  Save
} from 'lucide-react';
import { useState } from 'react';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    phone: "+1 (555) 123-4567",
    location: "New York, USA",
    dateOfBirth: "1990-05-15",
    sickleCellType: "HbSS",
    diagnosisYear: "1995"
  });

  const emergencyContacts = [
    {
      name: "Maria Rodriguez",
      relationship: "Mother",
      phone: "+1 (555) 987-6543",
      email: "maria.rodriguez@example.com"
    },
    {
      name: "Dr. Sarah Johnson",
      relationship: "Primary Care",
      phone: "+1 (555) 456-7890",
      email: "s.johnson@medicalcenter.com"
    }
  ];

  const notificationSettings = [
    { id: 'risk_alerts', label: 'High Risk Alerts', enabled: true },
    { id: 'daily_reminders', label: 'Daily Check-in Reminders', enabled: true },
    { id: 'caregiver_updates', label: 'Caregiver Update Notifications', enabled: true },
    { id: 'weekly_reports', label: 'Weekly Health Reports', enabled: false }
  ];

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save to your backend
    console.log('Saving profile:', profile);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Profile & Settings</h1>
              <p className="text-muted-foreground">Manage your personal information and preferences</p>
            </div>
            <button
              onClick={isEditing ? handleSave : () => setIsEditing(true)}
              className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
              {isEditing ? <Save className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
              {isEditing ? 'Save Changes' : 'Edit Profile'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Personal Information */}
            <div className="bg-card rounded-2xl p-6 border border-border">
              <h2 className="text-2xl font-bold mb-6">Personal Information</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  ) : (
                    <div className="flex items-center gap-3 p-2">
                      <User className="w-5 h-5 text-muted-foreground" />
                      <span>{profile.name}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  ) : (
                    <div className="flex items-center gap-3 p-2">
                      <Mail className="w-5 h-5 text-muted-foreground" />
                      <span>{profile.email}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Phone
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  ) : (
                    <div className="flex items-center gap-3 p-2">
                      <Phone className="w-5 h-5 text-muted-foreground" />
                      <span>{profile.phone}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Location
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.location}
                      onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  ) : (
                    <div className="flex items-center gap-3 p-2">
                      <MapPin className="w-5 h-5 text-muted-foreground" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Date of Birth
                  </label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={profile.dateOfBirth}
                      onChange={(e) => setProfile(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  ) : (
                    <div className="flex items-center gap-3 p-2">
                      <Calendar className="w-5 h-5 text-muted-foreground" />
                      <span>{new Date(profile.dateOfBirth).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Medical Information */}
            <div className="bg-card rounded-2xl p-6 border border-border">
              <h2 className="text-2xl font-bold mb-6">Medical Information</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Sickle Cell Type
                  </label>
                  {isEditing ? (
                    <select
                      value={profile.sickleCellType}
                      onChange={(e) => setProfile(prev => ({ ...prev, sickleCellType: e.target.value }))}
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="HbSS">HbSS (Most Common)</option>
                      <option value="HbSC">HbSC</option>
                      <option value="HbS Beta Thalassemia">HbS Beta Thalassemia</option>
                      <option value="Other">Other</option>
                    </select>
                  ) : (
                    <div className="flex items-center gap-3 p-2">
                      <Stethoscope className="w-5 h-5 text-muted-foreground" />
                      <span>{profile.sickleCellType}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Diagnosis Year
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={profile.diagnosisYear}
                      onChange={(e) => setProfile(prev => ({ ...prev, diagnosisYear: e.target.value }))}
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  ) : (
                    <div className="flex items-center gap-3 p-2">
                      <Calendar className="w-5 h-5 text-muted-foreground" />
                      <span>{profile.diagnosisYear}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Emergency Contacts */}
            <div className="bg-card rounded-2xl p-6 border border-border">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Emergency Contacts</h2>
                <button className="text-primary hover:underline text-sm">
                  + Add Contact
                </button>
              </div>
              
              <div className="space-y-4">
                {emergencyContacts.map((contact, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="font-semibold">{contact.name}</div>
                        <div className="text-sm text-muted-foreground">{contact.relationship}</div>
                        <div className="text-sm">{contact.phone}</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="text-primary hover:underline text-sm">Edit</button>
                      <button className="text-destructive hover:underline text-sm">Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Settings */}
          <div className="space-y-8">
            {/* Notification Settings */}
            <div className="bg-card rounded-2xl p-6 border border-border">
              <h2 className="text-2xl font-bold mb-6">Notification Settings</h2>
              
              <div className="space-y-4">
                {notificationSettings.map((setting) => (
                  <div key={setting.id} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{setting.label}</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={setting.enabled}
                        readOnly
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Privacy & Security */}
            <div className="bg-card rounded-2xl p-6 border border-border">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold">Privacy & Security</h2>
              </div>
              
              <div className="space-y-4">
                <button className="w-full text-left p-3 bg-muted rounded-lg hover:bg-accent transition-colors">
                  Change Password
                </button>
                <button className="w-full text-left p-3 bg-muted rounded-lg hover:bg-accent transition-colors">
                  Data Export
                </button>
                <button className="w-full text-left p-3 bg-muted rounded-lg hover:bg-accent transition-colors">
                  Privacy Settings
                </button>
              </div>
            </div>

            {/* Account Actions */}
            <div className="bg-card rounded-2xl p-6 border border-border">
              <h2 className="text-2xl font-bold mb-6">Account</h2>
              
              <div className="space-y-3">
                <button className="w-full text-left p-3 bg-muted rounded-lg hover:bg-accent transition-colors text-blue-600">
                  Download Medical Data
                </button>
                <button className="w-full text-left p-3 bg-muted rounded-lg hover:bg-accent transition-colors text-yellow-600">
                  Manage Caregiver Access
                </button>
                <button className="w-full text-left p-3 bg-muted rounded-lg hover:bg-accent transition-colors text-destructive">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}