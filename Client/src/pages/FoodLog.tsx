import React, { useState, useEffect, useRef } from "react"
import { useAppContext } from "../context/AppContext"
import type { FoodEntry, FormData } from "../types"
import Card from "../components/ui/Card"
import { mealColors, mealIcons, mealTypeOptions, quickActivitiesFoodLog } from "../assets/assets"
import Button from "../components/ui/Button"
import { Loader2Icon, PlusIcon, SparkleIcon, Trash2Icon, UtensilsCrossedIcon } from "lucide-react"
import Input from "../components/ui/Input"
import Select from "../components/ui/Select"
import toast from "react-hot-toast"
import api from "../config/api"

const FoodLog = () => {

  const { allFoodLogs, setAllFoodLogs } = useAppContext()

  const [entries, setEntries] = useState<FoodEntry[]>([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    calories: 0,
    mealType: ''
  })

  const [loading, setLoading] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)

  const totalCalories = entries.reduce((sum, e) => sum + e.calories, 0)
  const todayDate = new Date().toISOString().split('T')[0]

  const loadEntries = () => {
    const todayEntries = allFoodLogs.filter((e: FoodEntry) => e.createdAt?.split('T')[0] == todayDate)
    setEntries(todayEntries)
  }

  // Group entries by meal type
  const groupedEntries: Record<'breakfast' | 'lunch' | 'dinner' | 'snack', FoodEntry[]> = entries.reduce((acc, entry) => {
    if (!acc[entry.mealType]) {
      acc[entry.mealType] = [];
    }
    acc[entry.mealType].push(entry)
    return acc
  }, {} as Record<'breakfast' | 'lunch' | 'dinner' | 'snack', FoodEntry[]>)


  const handleQuickAdd = (activityName: string) => {
    setFormData({ ...formData, mealType: activityName })
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.calories || formData.calories <= 0 || !formData.mealType) {
      return toast.error('Please enter valid data')
    }
    try {
      const { data } = await api.post('/api/food-logs', { data: formData })
      setAllFoodLogs(prev => [...prev, data])
      setFormData({
        name: '',
        calories: 0,
        mealType: ''
      })
      setShowForm(false)
    } catch (error: any) {
      console.log(error);
      toast.error(error?.response?.data.error?.message || error.message)
    }
  }

  const handleDelete = async (documentId: string) => {
    try {
      const confirm = window.confirm('Are you sure you want to delete this entry?')
      if (!confirm) {
        return
      }
      await api.delete(`/api/food-logs/${documentId}`)
      setAllFoodLogs((prev) => prev.filter((e) => e.documentId !== documentId))  // state update
    } catch (error: any) {
      console.log(error);
      toast.error(error?.response?.data.error?.message || error.message)
    }
  }

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) {
      return
    }
    setLoading(true)
    const formData = new FormData()
    formData.append('image', file)
    try {
      const { data } = await api.post('/api/image-analysis', formData)
      const result = data.result;
      let mealType = '';

      const hour = new Date().getHours()
      if (hour >= 0 && hour < 12) {
        mealType = 'breakfast'
      } else if (hour >= 12 && hour < 16) {
        mealType = 'lunch'
      } else if (hour >= 16 && hour < 18) {
        mealType = 'snack'
      } else if (hour >= 18 && hour < 24) {
        mealType = 'dinner'
      }

      if (!mealType || !result.name || !result.calories) {
        return toast.error('Missing data')
      }
      // if available then save the result to the database
      const { data: newEntry } = await api.post('/api/food-logs/', {
        data: { name: result.name, calories: result.calories, mealType }
      })
      setAllFoodLogs(prev => [...prev, newEntry])
      // reset input
      if (inputRef.current) {
        inputRef.current.value = "" // reset
      }

    } catch (error: any) {
      console.log();
      console.log(error);
      toast.error(error?.response?.data.error?.message || error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    (() => {
      loadEntries()
    })();
  }, [allFoodLogs]) // everytime allFoodLogs changes 


  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Food Logs</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Track your daily intake</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-500 dark:text-slate-400">Today's Total</p>
            <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400"> {totalCalories} kcal</p>
          </div>
        </div>
      </div>

      {/* Main Part */}
      <div className="page-content-grid">
        {/* Add Section */}
        {!showForm && (
          <div className="space-y-4">
            <Card>
              <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-3">Quick Add</h3>
              <div className="flex flex-wrap gap-3">
                {quickActivitiesFoodLog.map((activity) => (
                  <button
                    onClick={() => handleQuickAdd(activity.name)}
                    className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 transition-colors"
                    key={activity.name}>
                    {activity.emoji}
                    {activity.name}
                  </button>
                ))}
              </div>
            </Card>

            <Button className="w-full" onClick={() => setShowForm(true)}>
              <PlusIcon className="size-5 " />Add Food Entry
            </Button>

            <Button className="w-full" onClick={() => { inputRef.current?.click() }}>
              <SparkleIcon className="size-5 " />AI Food Snap
            </Button>
            <input onChange={handleImage} type="file" accept="image/*" hidden ref={inputRef} />
            {loading && (
              <div className="fixed inset-0 bg-slate-100/50 dark:bg-slate-900/50 backdrop-blur flex items-center justify-center z-100">
                <Loader2Icon className="size-8 text-emerald-600 dark:text-emerald-400 animate-spin" />
              </div>
            )}
          </div>
        )}

        {/* Add Form :- if showForm is true then only the visible*/}
        {showForm && (
          <Card className="border-t border-emerald-200 dark:border-emerald-800">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-4">New Food Entry</h3>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <Input
                label="Food Name"
                value={formData.name}
                onChange={(val) => setFormData({ ...formData, name: val.toString() })}
                required
                placeholder="e.g., Shahi Paneer"
              />
              <Input
                type="number"
                label="Calories"
                value={formData.calories}
                onChange={(val) => setFormData({ ...formData, calories: Number(val) })}
                placeholder="e.g., 350"
                min={1}
                required
              />
              <Select
                label="Meal Type"
                value={formData.mealType}
                onChange={(val) => setFormData({ ...formData, mealType: val.toString() })}
                options={mealTypeOptions}
                placeholder="Select Meal type"
                required
              />

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1"
                  onClick={() => {
                    setShowForm(false)
                    setFormData({
                      name: '',
                      calories: 0,
                      mealType: ''
                    })
                  }}>Cancel</Button>

                <Button type="submit" className="flex-1"> Add Entry </Button>
              </div>

            </form>
          </Card>
        )}

        {/* Entris List */}
        {entries.length == 0 ? (
          <Card className="text-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
              <UtensilsCrossedIcon className="size-8 text-slate-400 dark:text-slate-500" />
            </div>
            <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-2">No Food Logged Today</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Start tracking your meals to stay on target</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {['breakfast', 'lunch', 'dinner', 'snack'].map((mealType) => {
              const mealTypeKey = mealType as keyof typeof groupedEntries
              if (!groupedEntries[mealTypeKey]) {
                return null;
              }
              const MealIcon = mealIcons[mealTypeKey];
              const mealCalories = groupedEntries[mealTypeKey].reduce((sum, e) => sum + e.calories, 0)

              return (
                <Card key={mealType}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${mealColors[mealTypeKey]}`}>
                        <MealIcon className='size-5' />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800 dark:text-white capitalize">{mealType}</h3>
                        <p className="test-sm text-slate-500 dark:text-slate-400"> {groupedEntries[mealTypeKey].length} items </p>
                      </div>
                    </div>
                    <p className="font-semibold text-slate-700 dark:text-slate-200"> {mealCalories} Kcal</p>
                  </div>

                  <div className="space-y-2">
                    {groupedEntries[mealTypeKey].map((entry) => (
                      <div className="food-entry-item" key={entry.id}>
                        <div className="flex-1">
                          <p className="font-medium text-slate-700 dark:text-slate-200"> {entry.name} </p>
                          <p className="ext-sm text-slate-400"> { } </p>
                        </div>
                        <div className="flex items-center gap-3">

                          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                            {entry.calories} Kcal
                          </span>

                          <button
                            onClick={() => handleDelete(entry?.documentId || '')}
                            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                            <Trash2Icon className="w-5 h-5 " />
                          </button>

                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default FoodLog