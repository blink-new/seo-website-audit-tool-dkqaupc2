import { useState } from 'react'
import { Search, Globe, CheckCircle, XCircle, AlertTriangle, Download, Loader2 } from 'lucide-react'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card'
import { Badge } from './components/ui/badge'
import { Progress } from './components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs'
import { Alert, AlertDescription } from './components/ui/alert'

interface SEOFactor {
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  category: string
}

interface AuditResult {
  score: number
  url: string
  positiveFactors: SEOFactor[]
  negativeFactors: SEOFactor[]
  recommendations: SEOFactor[]
  technicalMetrics: {
    pageSpeed: number
    mobileScore: number
    httpsEnabled: boolean
    metaTagsCount: number
    headingsStructure: boolean
    imageOptimization: number
  }
}

function App() {
  const [url, setUrl] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null)
  const [progress, setProgress] = useState(0)

  const handleAudit = async () => {
    if (!url) return

    setIsAnalyzing(true)
    setProgress(0)
    setAuditResult(null)

    // Simulate audit progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 300)

    // Simulate API call with mock data
    setTimeout(() => {
      clearInterval(progressInterval)
      setProgress(100)
      
      const mockResult: AuditResult = {
        score: Math.floor(Math.random() * 40) + 60, // Score between 60-100
        url,
        positiveFactors: [
          {
            title: 'HTTPS Enabled',
            description: 'Website uses secure HTTPS protocol',
            impact: 'high',
            category: 'Security'
          },
          {
            title: 'Mobile Responsive',
            description: 'Website is optimized for mobile devices',
            impact: 'high',
            category: 'Mobile'
          },
          {
            title: 'Fast Loading Speed',
            description: 'Page loads in under 3 seconds',
            impact: 'high',
            category: 'Performance'
          },
          {
            title: 'Meta Description Present',
            description: 'Page has a well-crafted meta description',
            impact: 'medium',
            category: 'Content'
          },
          {
            title: 'Alt Text on Images',
            description: 'Most images have descriptive alt text',
            impact: 'medium',
            category: 'Accessibility'
          }
        ],
        negativeFactors: [
          {
            title: 'Missing H1 Tag',
            description: 'Page is missing a proper H1 heading tag',
            impact: 'high',
            category: 'Content'
          },
          {
            title: 'Large Image Sizes',
            description: 'Some images are not optimized for web',
            impact: 'medium',
            category: 'Performance'
          },
          {
            title: 'No Structured Data',
            description: 'Missing schema markup for better search visibility',
            impact: 'medium',
            category: 'Technical'
          },
          {
            title: 'Slow Server Response',
            description: 'Server response time could be improved',
            impact: 'low',
            category: 'Performance'
          }
        ],
        recommendations: [
          {
            title: 'Add H1 Heading',
            description: 'Include a clear, keyword-rich H1 tag on every page',
            impact: 'high',
            category: 'Content'
          },
          {
            title: 'Optimize Images',
            description: 'Compress images and use modern formats like WebP',
            impact: 'medium',
            category: 'Performance'
          },
          {
            title: 'Implement Schema Markup',
            description: 'Add structured data to help search engines understand your content',
            impact: 'medium',
            category: 'Technical'
          },
          {
            title: 'Improve Server Response Time',
            description: 'Optimize server configuration and consider CDN implementation',
            impact: 'low',
            category: 'Performance'
          }
        ],
        technicalMetrics: {
          pageSpeed: Math.floor(Math.random() * 30) + 70,
          mobileScore: Math.floor(Math.random() * 20) + 80,
          httpsEnabled: true,
          metaTagsCount: Math.floor(Math.random() * 5) + 8,
          headingsStructure: Math.random() > 0.3,
          imageOptimization: Math.floor(Math.random() * 40) + 60
        }
      }

      setAuditResult(mockResult)
      setIsAnalyzing(false)
    }, 3000)
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getImpactBadge = (impact: string) => {
    const variants = {
      high: 'destructive',
      medium: 'default',
      low: 'secondary'
    } as const
    return variants[impact as keyof typeof variants] || 'default'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Globe className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-gray-900">SEO Audit Tool</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Analyze your website's SEO performance and get actionable recommendations 
            to improve your search engine rankings
          </p>
        </div>

        {/* URL Input Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Website Analysis
            </CardTitle>
            <CardDescription>
              Enter your website URL to start a comprehensive SEO audit
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1"
                disabled={isAnalyzing}
              />
              <Button 
                onClick={handleAudit} 
                disabled={!url || isAnalyzing}
                className="px-8"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Audit Website
                  </>
                )}
              </Button>
            </div>
            
            {isAnalyzing && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Analyzing website...</span>
                  <span className="text-sm text-gray-600">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Section */}
        {auditResult && (
          <div className="space-y-6">
            {/* SEO Score Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>SEO Score Overview</span>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export Report
                  </Button>
                </CardTitle>
                <CardDescription>
                  Overall SEO performance for {auditResult.url}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className={`text-4xl font-bold ${getScoreColor(auditResult.score)}`}>
                      {auditResult.score}
                    </div>
                    <div className="text-sm text-gray-600">Overall Score</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-semibold ${getScoreColor(auditResult.technicalMetrics.pageSpeed)}`}>
                      {auditResult.technicalMetrics.pageSpeed}
                    </div>
                    <div className="text-sm text-gray-600">Page Speed</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-semibold ${getScoreColor(auditResult.technicalMetrics.mobileScore)}`}>
                      {auditResult.technicalMetrics.mobileScore}
                    </div>
                    <div className="text-sm text-gray-600">Mobile Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-semibold text-green-600">
                      {auditResult.technicalMetrics.httpsEnabled ? 'Yes' : 'No'}
                    </div>
                    <div className="text-sm text-gray-600">HTTPS Enabled</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Analysis */}
            <Tabs defaultValue="positive" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="positive" className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Positive Factors
                </TabsTrigger>
                <TabsTrigger value="negative" className="flex items-center gap-2">
                  <XCircle className="h-4 w-4" />
                  Issues Found
                </TabsTrigger>
                <TabsTrigger value="recommendations" className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Recommendations
                </TabsTrigger>
                <TabsTrigger value="technical">
                  Technical Metrics
                </TabsTrigger>
              </TabsList>

              <TabsContent value="positive" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-green-600 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      Positive SEO Factors ({auditResult.positiveFactors.length})
                    </CardTitle>
                    <CardDescription>
                      These factors are helping your SEO performance
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {auditResult.positiveFactors.map((factor, index) => (
                        <div key={index} className="border rounded-lg p-4 bg-green-50">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold text-green-800">{factor.title}</h4>
                              <p className="text-sm text-green-700 mt-1">{factor.description}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline" className="text-xs">
                                  {factor.category}
                                </Badge>
                                <Badge variant={getImpactBadge(factor.impact)} className="text-xs">
                                  {factor.impact} impact
                                </Badge>
                              </div>
                            </div>
                            <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="negative" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-red-600 flex items-center gap-2">
                      <XCircle className="h-5 w-5" />
                      Issues Found ({auditResult.negativeFactors.length})
                    </CardTitle>
                    <CardDescription>
                      These issues may be hurting your SEO performance
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {auditResult.negativeFactors.map((factor, index) => (
                        <div key={index} className="border rounded-lg p-4 bg-red-50">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold text-red-800">{factor.title}</h4>
                              <p className="text-sm text-red-700 mt-1">{factor.description}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline" className="text-xs">
                                  {factor.category}
                                </Badge>
                                <Badge variant={getImpactBadge(factor.impact)} className="text-xs">
                                  {factor.impact} impact
                                </Badge>
                              </div>
                            </div>
                            <XCircle className="h-5 w-5 text-red-600 mt-1" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="recommendations" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-blue-600 flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Actionable Recommendations ({auditResult.recommendations.length})
                    </CardTitle>
                    <CardDescription>
                      Follow these recommendations to improve your SEO score
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {auditResult.recommendations.map((recommendation, index) => (
                        <div key={index} className="border rounded-lg p-4 bg-blue-50">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold text-blue-800">{recommendation.title}</h4>
                              <p className="text-sm text-blue-700 mt-1">{recommendation.description}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline" className="text-xs">
                                  {recommendation.category}
                                </Badge>
                                <Badge variant={getImpactBadge(recommendation.impact)} className="text-xs">
                                  {recommendation.impact} impact
                                </Badge>
                              </div>
                            </div>
                            <AlertTriangle className="h-5 w-5 text-blue-600 mt-1" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="technical" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Technical SEO Metrics</CardTitle>
                    <CardDescription>
                      Detailed technical analysis of your website
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">Page Speed Score</span>
                            <span className={`text-sm font-semibold ${getScoreColor(auditResult.technicalMetrics.pageSpeed)}`}>
                              {auditResult.technicalMetrics.pageSpeed}/100
                            </span>
                          </div>
                          <Progress value={auditResult.technicalMetrics.pageSpeed} className="h-2" />
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">Mobile Optimization</span>
                            <span className={`text-sm font-semibold ${getScoreColor(auditResult.technicalMetrics.mobileScore)}`}>
                              {auditResult.technicalMetrics.mobileScore}/100
                            </span>
                          </div>
                          <Progress value={auditResult.technicalMetrics.mobileScore} className="h-2" />
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">Image Optimization</span>
                            <span className={`text-sm font-semibold ${getScoreColor(auditResult.technicalMetrics.imageOptimization)}`}>
                              {auditResult.technicalMetrics.imageOptimization}/100
                            </span>
                          </div>
                          <Progress value={auditResult.technicalMetrics.imageOptimization} className="h-2" />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <Alert>
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            <strong>Meta Tags Found:</strong> {auditResult.technicalMetrics.metaTagsCount} tags detected
                          </AlertDescription>
                        </Alert>

                        <Alert>
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            <strong>Heading Structure:</strong> {auditResult.technicalMetrics.headingsStructure ? 'Properly structured' : 'Needs improvement'}
                          </AlertDescription>
                        </Alert>

                        <Alert>
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            <strong>HTTPS Security:</strong> {auditResult.technicalMetrics.httpsEnabled ? 'Enabled' : 'Not enabled'}
                          </AlertDescription>
                        </Alert>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  )
}

export default App