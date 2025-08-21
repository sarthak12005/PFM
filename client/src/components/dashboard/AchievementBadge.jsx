import React, { useState } from 'react'
import { Award, Star, Trophy, Medal, Crown } from 'lucide-react'

const AchievementBadge = ({ achievements }) => {
  const [selectedAchievement, setSelectedAchievement] = useState(null)

  const getRarityConfig = (rarity) => {
    switch (rarity) {
      case 'common':
        return {
          color: 'from-gray-400 to-gray-600',
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          text: 'text-gray-700',
          icon: Medal
        }
      case 'rare':
        return {
          color: 'from-blue-400 to-blue-600',
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-700',
          icon: Star
        }
      case 'epic':
        return {
          color: 'from-purple-400 to-purple-600',
          bg: 'bg-purple-50',
          border: 'border-purple-200',
          text: 'text-purple-700',
          icon: Trophy
        }
      case 'legendary':
        return {
          color: 'from-yellow-400 to-orange-500',
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          text: 'text-yellow-700',
          icon: Crown
        }
      default:
        return {
          color: 'from-gray-400 to-gray-600',
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          text: 'text-gray-700',
          icon: Award
        }
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const recentAchievements = achievements.slice(0, 3)
  const totalAchievements = achievements.length

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Award size={20} className="text-yellow-600" />
            <h3 className="card-title">Achievements</h3>
          </div>
          <span className="text-sm text-gray-500">{totalAchievements} earned</span>
        </div>
        <p className="card-description">Your financial milestones</p>
      </div>
      
      <div className="card-content">
        {achievements.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Award size={24} className="text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">No achievements yet</p>
            <p className="text-sm text-gray-400">Start using SaveWise to earn badges!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Recent Achievements */}
            <div className="space-y-3">
              {recentAchievements.map((achievement) => {
                const rarityConfig = getRarityConfig(achievement.rarity)
                const RarityIcon = rarityConfig.icon
                
                return (
                  <div
                    key={achievement.id}
                    onClick={() => setSelectedAchievement(achievement)}
                    className={`p-3 rounded-lg border ${rarityConfig.bg} ${rarityConfig.border} cursor-pointer hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5`}
                  >
                    <div className="flex items-center space-x-3">
                      {/* Achievement Icon */}
                      <div className="relative">
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${rarityConfig.color} flex items-center justify-center shadow-lg`}>
                          <span className="text-2xl">{achievement.icon}</span>
                        </div>
                        <div className="absolute -bottom-1 -right-1">
                          <div className={`w-5 h-5 rounded-full ${rarityConfig.bg} border ${rarityConfig.border} flex items-center justify-center`}>
                            <RarityIcon size={10} className={rarityConfig.text} />
                          </div>
                        </div>
                      </div>
                      
                      {/* Achievement Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-gray-900 truncate">
                            {achievement.title}
                          </h4>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${rarityConfig.bg} ${rarityConfig.text} border ${rarityConfig.border}`}>
                            {achievement.rarity}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {achievement.description}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Earned on {formatDate(achievement.dateAchieved)}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Achievement Stats */}
            <div className="pt-4 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{totalAchievements}</div>
                  <div className="text-xs text-gray-500">Total Badges</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {achievements.filter(a => a.rarity === 'legendary').length}
                  </div>
                  <div className="text-xs text-gray-500">Legendary</div>
                </div>
              </div>
            </div>

            {/* View All Button */}
            {achievements.length > 3 && (
              <div className="pt-2">
                <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
                  View All {totalAchievements} Achievements
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Achievement Detail Modal */}
      {selectedAchievement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="text-center">
                {/* Large Achievement Icon */}
                <div className="relative mx-auto mb-4">
                  <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${getRarityConfig(selectedAchievement.rarity).color} flex items-center justify-center shadow-lg`}>
                    <span className="text-4xl">{selectedAchievement.icon}</span>
                  </div>
                  <div className="absolute -bottom-2 -right-2">
                    <div className={`w-8 h-8 rounded-full ${getRarityConfig(selectedAchievement.rarity).bg} border-2 ${getRarityConfig(selectedAchievement.rarity).border} flex items-center justify-center`}>
                      {React.createElement(getRarityConfig(selectedAchievement.rarity).icon, { 
                        size: 14, 
                        className: getRarityConfig(selectedAchievement.rarity).text 
                      })}
                    </div>
                  </div>
                </div>

                {/* Achievement Details */}
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {selectedAchievement.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {selectedAchievement.description}
                </p>
                
                {/* Rarity and Date */}
                <div className="flex items-center justify-center space-x-4 mb-6">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRarityConfig(selectedAchievement.rarity).bg} ${getRarityConfig(selectedAchievement.rarity).text} border ${getRarityConfig(selectedAchievement.rarity).border}`}>
                    {selectedAchievement.rarity.charAt(0).toUpperCase() + selectedAchievement.rarity.slice(1)}
                  </span>
                  <span className="text-sm text-gray-500">
                    {formatDate(selectedAchievement.dateAchieved)}
                  </span>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setSelectedAchievement(null)}
                  className="btn-primary w-full"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AchievementBadge
