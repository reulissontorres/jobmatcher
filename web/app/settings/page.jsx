'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import FormInput from '@/components/FormInput'
import { useAuth } from '@/context/AuthContext'
import { User, Building2, Bell, Palette, Save, X } from 'lucide-react'

const tabs = [
  { id: 'profile', label: 'Perfil', icon: User },
  { id: 'organization', label: 'Organizacao', icon: Building2 },
  { id: 'notifications', label: 'Notificacoes', icon: Bell },
  { id: 'branding', label: 'Marca', icon: Palette }
]

export default function SettingsPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [isSaving, setIsSaving] = useState(false)

  // Profile form state
  const [profileData, setProfileData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: user?.email || 'admin@acme.com',
    phone: '+55 (11) 99999-9999',
    role: 'Gerente de Recrutamento'
  })

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const handleProfileChange = (field) => (e) => {
    setProfileData(prev => ({ ...prev, [field]: e.target.value }))
  }

  const handlePasswordChange = (field) => (e) => {
    setPasswordData(prev => ({ ...prev, [field]: e.target.value }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
  }

  const getInitials = (firstName, lastName) => {
    return `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase()
  }

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Configuracoes</h1>
          <p className="mt-1 text-muted-foreground">
            Gerencie suas preferencias de conta e organizacao
          </p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 p-1 bg-muted rounded-lg w-fit mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${
                activeTab === tab.id
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Profile Tab Content */}
        {activeTab === 'profile' && (
          <div className="bg-background rounded-xl border border-border p-6 max-w-3xl">
            {/* Profile Information */}
            <h2 className="text-lg font-semibold text-foreground mb-6">Informacoes do Perfil</h2>

            {/* Avatar */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold text-2xl">
                {getInitials(profileData.firstName, profileData.lastName)}
              </div>
              <div>
                <button className="px-4 py-2 bg-background border border-border text-foreground text-sm font-medium rounded-lg hover:bg-muted transition-colors">
                  Alterar Foto
                </button>
                <p className="text-xs text-muted-foreground mt-1">JPG, PNG ou GIF. Max 2MB.</p>
              </div>
            </div>

            {/* Form */}
            <div className="flex flex-col gap-6">
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Nome"
                  value={profileData.firstName}
                  onChange={handleProfileChange('firstName')}
                />
                <FormInput
                  label="Sobrenome"
                  value={profileData.lastName}
                  onChange={handleProfileChange('lastName')}
                />
              </div>

              {/* Email */}
              <FormInput
                label="Email"
                type="email"
                value={profileData.email}
                onChange={handleProfileChange('email')}
              />

              {/* Phone */}
              <FormInput
                label="Telefone"
                value={profileData.phone}
                onChange={handleProfileChange('phone')}
              />

              {/* Role */}
              <FormInput
                label="Cargo"
                value={profileData.role}
                onChange={handleProfileChange('role')}
              />

              {/* Divider */}
              <div className="border-t border-border my-4" />

              {/* Change Password Section */}
              <h2 className="text-lg font-semibold text-foreground">Alterar Senha</h2>

              <FormInput
                label="Senha Atual"
                type="password"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange('currentPassword')}
              />

              <FormInput
                label="Nova Senha"
                type="password"
                value={passwordData.newPassword}
                onChange={handlePasswordChange('newPassword')}
              />

              <FormInput
                label="Confirmar Nova Senha"
                type="password"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange('confirmPassword')}
              />

              {/* Actions */}
              <div className="flex items-center gap-4 mt-4">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium rounded-lg hover:from-emerald-600 hover:to-emerald-700 disabled:opacity-50 transition-all"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? 'Salvando...' : 'Salvar Alteracoes'}
                </button>
                <button className="flex items-center gap-2 px-6 py-2.5 bg-background border border-border text-foreground font-medium rounded-lg hover:bg-muted transition-colors">
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Organization Tab Content */}
        {activeTab === 'organization' && (
          <div className="bg-background rounded-xl border border-border p-6 max-w-3xl">
            <h2 className="text-lg font-semibold text-foreground mb-6">Informacoes da Organizacao</h2>
            <div className="flex flex-col gap-6">
              <FormInput
                label="Nome da Organizacao"
                value={user?.organizationName || 'Acme Corp'}
                onChange={() => {}}
              />
              <FormInput
                label="Tipo de Organizacao"
                value={user?.organizationType === 'company' ? 'Empresa' : user?.organizationType === 'university' ? 'Universidade' : 'Governo'}
                onChange={() => {}}
              />
              <FormInput
                label="Website"
                value="https://acme.com"
                onChange={() => {}}
              />
              <FormInput
                label="Endereco"
                value="Av. Paulista, 1000 - Sao Paulo, SP"
                onChange={() => {}}
              />
              <div className="flex items-center gap-4 mt-4">
                <button className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all">
                  <Save className="w-4 h-4" />
                  Salvar Alteracoes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Tab Content */}
        {activeTab === 'notifications' && (
          <div className="bg-background rounded-xl border border-border p-6 max-w-3xl">
            <h2 className="text-lg font-semibold text-foreground mb-6">Preferencias de Notificacao</h2>
            <div className="flex flex-col gap-4">
              {[
                { label: 'Novos candidatos correspondentes', description: 'Receba notificacoes quando novos candidatos corresponderem as suas vagas' },
                { label: 'Candidaturas recebidas', description: 'Seja notificado quando candidatos se inscreverem nas suas vagas' },
                { label: 'Atualizacoes do sistema', description: 'Receba informacoes sobre novos recursos e atualizacoes' },
                { label: 'Relatorios semanais', description: 'Receba um resumo semanal das suas atividades de recrutamento' }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between py-4 border-b border-border last:border-0">
                  <div>
                    <p className="font-medium text-foreground">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:bg-emerald-500 peer-focus:ring-2 peer-focus:ring-emerald-300 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Branding Tab Content */}
        {activeTab === 'branding' && (
          <div className="bg-background rounded-xl border border-border p-6 max-w-3xl">
            <h2 className="text-lg font-semibold text-foreground mb-6">Personalizacao da Marca</h2>
            <div className="flex flex-col gap-6">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Logo da Empresa</label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-white font-bold text-xl">
                    AC
                  </div>
                  <button className="px-4 py-2 bg-background border border-border text-foreground text-sm font-medium rounded-lg hover:bg-muted transition-colors">
                    Alterar Logo
                  </button>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Cor Principal</label>
                <div className="flex items-center gap-2">
                  {['#8B5CF6', '#10B981', '#3B82F6', '#EF4444', '#F59E0B', '#EC4899'].map((color) => (
                    <button
                      key={color}
                      className="w-10 h-10 rounded-lg border-2 border-transparent hover:border-foreground transition-colors"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-4 mt-4">
                <button className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all">
                  <Save className="w-4 h-4" />
                  Salvar Alteracoes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
