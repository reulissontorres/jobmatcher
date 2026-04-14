'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { MessageSquare, Send, Phone, CheckCircle2, Clock, Sparkles } from 'lucide-react'

const mockMessages = [
  {
    id: 1,
    type: 'received',
    content: 'Oi! Vi a vaga de React Developer e tenho interesse. Tenho 5 anos de experiencia.',
    time: '10:30'
  },
  {
    id: 2,
    type: 'sent',
    content: 'Ola! Obrigado pelo interesse. Pode me contar mais sobre sua experiencia com React e TypeScript?',
    time: '10:32',
    status: 'read'
  },
  {
    id: 3,
    type: 'received',
    content: 'Claro! Trabalhei em projetos de grande escala usando React, TypeScript, Node.js e AWS. Atualmente sou Tech Lead em uma startup.',
    time: '10:35'
  },
  {
    id: 4,
    type: 'ai-suggestion',
    content: 'Baseado nas habilidades mencionadas, este candidato tem 89% de compatibilidade com a vaga de Senior React Developer.',
    time: '10:35'
  }
]

export default function WhatsAppDemoPage() {
  const [messages, setMessages] = useState(mockMessages)
  const [newMessage, setNewMessage] = useState('')

  const handleSend = () => {
    if (!newMessage.trim()) return

    setMessages([
      ...messages,
      {
        id: messages.length + 1,
        type: 'sent',
        content: newMessage,
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        status: 'sent'
      }
    ])
    setNewMessage('')
  }

  return (
    <DashboardLayout>
      <div className="p-8 h-[calc(100vh-2rem)]">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">WhatsApp Demo</h1>
          <p className="mt-1 text-muted-foreground">
            Veja como a IA ajuda a qualificar candidatos via WhatsApp
          </p>
        </div>

        {/* Chat Container */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100%-6rem)]">
          {/* Chat List */}
          <div className="bg-background rounded-xl border border-border overflow-hidden">
            <div className="p-4 border-b border-border">
              <h2 className="font-semibold text-foreground">Conversas</h2>
            </div>
            <div className="divide-y divide-border">
              {[
                { name: 'Maria Silva', message: 'Tenho interesse na vaga...', time: '10:35', unread: 2 },
                { name: 'Joao Santos', message: 'Qual o salario?', time: '09:20', unread: 0 },
                { name: 'Ana Costa', message: 'Obrigada pela resposta!', time: 'Ontem', unread: 0 }
              ].map((chat, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-4 hover:bg-muted cursor-pointer transition-colors ${index === 0 ? 'bg-purple-50' : ''}`}
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-white font-medium">
                    {chat.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-foreground">{chat.name}</p>
                      <span className="text-xs text-muted-foreground">{chat.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{chat.message}</p>
                  </div>
                  {chat.unread > 0 && (
                    <span className="w-5 h-5 bg-emerald-500 text-white text-xs rounded-full flex items-center justify-center">
                      {chat.unread}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Chat Window */}
          <div className="lg:col-span-2 bg-background rounded-xl border border-border flex flex-col overflow-hidden">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-white font-medium">
                  MS
                </div>
                <div>
                  <p className="font-medium text-foreground">Maria Silva</p>
                  <p className="text-xs text-emerald-500">Online</p>
                </div>
              </div>
              <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors">
                <Phone className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-slate-50 flex flex-col gap-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'sent' ? 'justify-end' : message.type === 'ai-suggestion' ? 'justify-center' : 'justify-start'}`}
                >
                  {message.type === 'ai-suggestion' ? (
                    <div className="max-w-md px-4 py-3 bg-purple-50 border border-purple-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Sparkles className="w-4 h-4 text-purple-500" />
                        <span className="text-xs font-medium text-purple-600">Sugestao da IA</span>
                      </div>
                      <p className="text-sm text-purple-700">{message.content}</p>
                    </div>
                  ) : (
                    <div
                      className={`max-w-md px-4 py-2 rounded-lg ${
                        message.type === 'sent'
                          ? 'bg-emerald-500 text-white rounded-br-none'
                          : 'bg-white text-foreground rounded-bl-none border border-border'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <div className={`flex items-center justify-end gap-1 mt-1 ${message.type === 'sent' ? 'text-emerald-100' : 'text-muted-foreground'}`}>
                        <span className="text-xs">{message.time}</span>
                        {message.type === 'sent' && (
                          message.status === 'read' ? (
                            <CheckCircle2 className="w-3 h-3" />
                          ) : (
                            <Clock className="w-3 h-3" />
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Digite uma mensagem..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  className="flex-1 px-4 py-2.5 bg-muted rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                />
                <button
                  onClick={handleSend}
                  className="p-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
