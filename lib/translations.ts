export type Lang = 'en' | 'zh'

export const translations = {
  en: {
    // Header
    appName: 'SnapCal',
    appNameAccent: 'AI',
    keySet: 'Key set ✓',
    byok: 'Bring Your\nOwn Key',

    // Upload zone
    mealPhoto: 'Meal Photo',
    tapToUpload: 'Tap to upload a photo',
    fileTypes: 'JPG · PNG · WEBP',
    orDragDrop: 'or drag & drop',
    takePhoto: '📸 Take Photo',
    chooseFromGallery: '🖼️ Choose from Gallery',
    weight: 'Weight',
    weightPlaceholder: 'Leave blank — AI will estimate',
    changeImage: '↑ Change',
    analyzing: 'Analysing...',
    analyzeButton: '✨ Analyse Calories',
    errorUploadFirst: 'Please upload a photo first!',
    errorAnalysisFailed: 'Analysis failed',

    // Result panel
    estimatedNutrition: 'Estimated Nutrition',
    calories: 'Calories',
    protein: 'Protein',
    carbs: 'Carbs',
    fats: 'Fats',
    fiber: 'Fiber',
    aiEstimatedWeight: '🤖 AI estimated weight:',
    identified: 'Identified: ',
    disclaimer: '💡 These are estimates for reference only. Actual values may vary by cooking method and ingredients.',
    noAnalysisYet: 'No analysis yet',
    noAnalysisSub: 'Upload a meal photo and tap\nAnalyse Calories to get started',

    // Health score
    healthScore: 'Health Score',
    badgeExcellent: 'Excellent',
    badgeGood: 'Good',
    badgeAverage: 'Average',
    badgeTreat: 'Treat Meal',

    // AI insight
    aiInsightTitle: 'AI Insight',

    // Key modal
    keyModalTitle: '🔑 Your Gemini API Key',
    keyModalDesc: "Your key is stored only in your browser — never sent to any server.",
    keyModalNoKey: "Don't have one?",
    keyModalGetFree: 'Get it free →',
    save: 'Save',
    cancel: 'Cancel',
  },
  zh: {
    // Header
    appName: 'SnapCal',
    appNameAccent: 'AI',
    keySet: 'Key 已设置 ✓',
    byok: '自带 API Key',

    // Upload zone
    mealPhoto: '餐食照片',
    tapToUpload: '点击上传照片',
    fileTypes: 'JPG · PNG · WEBP',
    orDragDrop: '或拖放图片',
    takePhoto: '📸 拍照',
    chooseFromGallery: '🖼️ 从相册选择',
    weight: '重量',
    weightPlaceholder: '留空让 AI 自动估算',
    changeImage: '↑ 更换',
    analyzing: '分析中...',
    analyzeButton: '✨ 分析卡路里',
    errorUploadFirst: '请先上传图片！',
    errorAnalysisFailed: '分析失败',

    // Result panel
    estimatedNutrition: '营养估算',
    calories: '卡路里',
    protein: '蛋白质',
    carbs: '碳水',
    fats: '脂肪',
    fiber: '膳食纤维',
    aiEstimatedWeight: '🤖 AI 估算重量：',
    identified: '识别食物：',
    disclaimer: '💡 结果仅供参考，实际数值因烹饪方式与食材而异。',
    noAnalysisYet: '尚未分析',
    noAnalysisSub: '上传一张餐食照片，点击\n「分析卡路里」开始',

    // Health score
    healthScore: '健康分数',
    badgeExcellent: '优秀',
    badgeGood: '良好',
    badgeAverage: '一般',
    badgeTreat: '放纵餐',

    // AI insight
    aiInsightTitle: 'AI 小贴士',

    // Key modal
    keyModalTitle: '🔑 填入你的 Gemini API Key',
    keyModalDesc: 'Key 只存在你的浏览器里，不会传到任何服务器。',
    keyModalNoKey: '还没有 key？',
    keyModalGetFree: '免费获取 →',
    save: '保存',
    cancel: '取消',

  },
} satisfies Record<Lang, Record<string, string>>

export type TranslationKey = keyof typeof translations.en