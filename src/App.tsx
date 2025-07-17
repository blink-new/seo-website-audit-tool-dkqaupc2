import { useState } from 'react'
import { Search, Globe, CheckCircle, XCircle, AlertTriangle, Download, Loader2, Shield, Smartphone, Zap, Eye, BarChart3, Image, Link, FileText } from 'lucide-react'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card'
import { Badge } from './components/ui/badge'
import { Progress } from './components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs'
import { Alert, AlertDescription } from './components/ui/alert'
import { SEOAnalyzer, type AuditResult, type SEOFactor } from './services/seoAnalyzer'

function App() {
  const [url, setUrl] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const seoAnalyzer = new SEOAnalyzer()

  const handleAudit = async () => {
    if (!url) return

    setIsAnalyzing(true)
    setProgress(0)
    setAuditResult(null)
    setError(null)

    try {
      const result = await seoAnalyzer.analyzeWebsite(url, (progressValue) => {
        setProgress(progressValue)
      })
      setAuditResult(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during analysis')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBackground = (score: number) => {
    if (score >= 80) return 'bg-green-50 border-green-200'
    if (score >= 60) return 'bg-yellow-50 border-yellow-200'
    return 'bg-red-50 border-red-200'
  }

  const getImpactBadge = (impact: string) => {
    const variants = {
      high: 'destructive',
      medium: 'default',
      low: 'secondary'
    } as const
    return variants[impact as keyof typeof variants] || 'default'
  }

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'fail':
        return <XCircle className="h-4 w-4 text-red-600" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      default:
        return null
    }
  }

  const formatCoreWebVital = (value: number, type: 'lcp' | 'fid' | 'cls') => {
    switch (type) {
      case 'lcp':
        return `${(value / 1000).toFixed(1)}s`
      case 'fid':
        return `${value.toFixed(0)}ms`
      case 'cls':
        return value.toFixed(3)
      default:
        return value.toString()
    }
  }

  const getCoreWebVitalStatus = (value: number, type: 'lcp' | 'fid' | 'cls') => {
    switch (type) {
      case 'lcp':
        return value <= 2500 ? 'good' : value <= 4000 ? 'needs-improvement' : 'poor'
      case 'fid':
        return value <= 100 ? 'good' : value <= 300 ? 'needs-improvement' : 'poor'
      case 'cls':
        return value <= 0.1 ? 'good' : value <= 0.25 ? 'needs-improvement' : 'poor'
      default:
        return 'good'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'text-green-600'
      case 'needs-improvement':
        return 'text-yellow-600'
      case 'poor':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Globe className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-gray-900">SEO Audit Tool</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive SEO analysis powered by real-time web scraping and performance metrics. 
            Get actionable insights to improve your search engine rankings.
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
              Enter your website URL to start a comprehensive SEO audit using real-time data
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
                  <span className="text-sm text-gray-600">
                    {progress < 30 ? 'Scraping website content...' :
                     progress < 60 ? 'Analyzing performance metrics...' :
                     progress < 80 ? 'Evaluating SEO factors...' :
                     progress < 95 ? 'Generating recommendations...' :
                     'Finalizing report...'}
                  </span>
                  <span className="text-sm text-gray-600">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}

            {error && (
              <Alert className="mt-4 border-red-200 bg-red-50">
                <XCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  {error}
                </AlertDescription>
              </Alert>
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
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  <div className={`text-center p-4 rounded-lg border ${getScoreBackground(auditResult.score)}`}>
                    <div className={`text-3xl font-bold ${getScoreColor(auditResult.score)}`}>
                      {auditResult.score}
                    </div>
                    <div className="text-sm text-gray-600 font-medium">Overall Score</div>
                  </div>
                  <div className={`text-center p-4 rounded-lg border ${getScoreBackground(auditResult.technicalMetrics.performance)}`}>
                    <Zap className="h-6 w-6 mx-auto mb-1 text-blue-600" />
                    <div className={`text-xl font-semibold ${getScoreColor(auditResult.technicalMetrics.performance)}`}>
                      {auditResult.technicalMetrics.performance}
                    </div>
                    <div className="text-sm text-gray-600">Performance</div>
                  </div>
                  <div className={`text-center p-4 rounded-lg border ${getScoreBackground(auditResult.technicalMetrics.seoScore)}`}>
                    <Search className="h-6 w-6 mx-auto mb-1 text-green-600" />
                    <div className={`text-xl font-semibold ${getScoreColor(auditResult.technicalMetrics.seoScore)}`}>
                      {auditResult.technicalMetrics.seoScore}
                    </div>
                    <div className="text-sm text-gray-600">SEO Score</div>
                  </div>
                  <div className={`text-center p-4 rounded-lg border ${getScoreBackground(auditResult.technicalMetrics.accessibility)}`}>
                    <Eye className="h-6 w-6 mx-auto mb-1 text-purple-600" />
                    <div className={`text-xl font-semibold ${getScoreColor(auditResult.technicalMetrics.accessibility)}`}>
                      {auditResult.technicalMetrics.accessibility}
                    </div>
                    <div className="text-sm text-gray-600">Accessibility</div>
                  </div>
                  <div className={`text-center p-4 rounded-lg border ${getScoreBackground(auditResult.technicalMetrics.bestPractices)}`}>
                    <Shield className="h-6 w-6 mx-auto mb-1 text-indigo-600" />
                    <div className={`text-xl font-semibold ${getScoreColor(auditResult.technicalMetrics.bestPractices)}`}>
                      {auditResult.technicalMetrics.bestPractices}
                    </div>
                    <div className="text-sm text-gray-600">Best Practices</div>
                  </div>
                  <div className="text-center p-4 rounded-lg border bg-gray-50 border-gray-200">
                    <Smartphone className="h-6 w-6 mx-auto mb-1 text-gray-600" />
                    <div className="text-xl font-semibold text-green-600">
                      {auditResult.technicalMetrics.httpsEnabled ? 'Yes' : 'No'}
                    </div>
                    <div className="text-sm text-gray-600">HTTPS</div>
                  </div>
                </div>

                {/* Core Web Vitals */}
                <div className="mt-6 pt-6 border-t">
                  <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Core Web Vitals
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-white rounded-lg border">
                      <div className={`text-2xl font-bold ${getStatusColor(getCoreWebVitalStatus(auditResult.technicalMetrics.coreWebVitals.lcp, 'lcp'))}`}>
                        {formatCoreWebVital(auditResult.technicalMetrics.coreWebVitals.lcp, 'lcp')}
                      </div>
                      <div className="text-sm text-gray-600">Largest Contentful Paint</div>
                      <div className="text-xs text-gray-500 mt-1">Good: ≤2.5s</div>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg border">
                      <div className={`text-2xl font-bold ${getStatusColor(getCoreWebVitalStatus(auditResult.technicalMetrics.coreWebVitals.fid, 'fid'))}`}>
                        {formatCoreWebVital(auditResult.technicalMetrics.coreWebVitals.fid, 'fid')}
                      </div>
                      <div className="text-sm text-gray-600">First Input Delay</div>
                      <div className="text-xs text-gray-500 mt-1">Good: ≤100ms</div>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg border">
                      <div className={`text-2xl font-bold ${getStatusColor(getCoreWebVitalStatus(auditResult.technicalMetrics.coreWebVitals.cls, 'cls'))}`}>
                        {formatCoreWebVital(auditResult.technicalMetrics.coreWebVitals.cls, 'cls')}
                      </div>
                      <div className="text-sm text-gray-600">Cumulative Layout Shift</div>
                      <div className="text-xs text-gray-500 mt-1">Good: ≤0.1</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Analysis */}
            <Tabs defaultValue="positive" className="w-full">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="positive" className="flex items-center gap-1 text-xs">
                  <CheckCircle className="h-3 w-3" />
                  Positive
                </TabsTrigger>
                <TabsTrigger value="negative" className="flex items-center gap-1 text-xs">
                  <XCircle className="h-3 w-3" />
                  Issues
                </TabsTrigger>
                <TabsTrigger value="recommendations" className="flex items-center gap-1 text-xs">
                  <AlertTriangle className="h-3 w-3" />
                  Recommendations
                </TabsTrigger>
                <TabsTrigger value="content" className="flex items-center gap-1 text-xs">
                  <FileText className="h-3 w-3" />
                  Content
                </TabsTrigger>
                <TabsTrigger value="technical" className="flex items-center gap-1 text-xs">
                  <BarChart3 className="h-3 w-3" />
                  Technical
                </TabsTrigger>
                <TabsTrigger value="social" className="flex items-center gap-1 text-xs">
                  <Link className="h-3 w-3" />
                  Social
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
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-green-800">{factor.title}</h4>
                                {getStatusIcon(factor.status)}
                              </div>
                              <p className="text-sm text-green-700 mb-2">{factor.description}</p>
                              {factor.value && (
                                <div className="text-sm font-medium text-green-800 mb-2">
                                  Value: {factor.value}
                                </div>
                              )}
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  {factor.category}
                                </Badge>
                                <Badge variant={getImpactBadge(factor.impact)} className="text-xs">
                                  {factor.impact} impact
                                </Badge>
                              </div>
                            </div>
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
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-red-800">{factor.title}</h4>
                                {getStatusIcon(factor.status)}
                              </div>
                              <p className="text-sm text-red-700 mb-2">{factor.description}</p>
                              {factor.value && (
                                <div className="text-sm font-medium text-red-800 mb-2">
                                  Current: {factor.value}
                                </div>
                              )}
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  {factor.category}
                                </Badge>
                                <Badge variant={getImpactBadge(factor.impact)} className="text-xs">
                                  {factor.impact} impact
                                </Badge>
                              </div>
                            </div>
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
                              <h4 className="font-semibold text-blue-800 mb-1">{recommendation.title}</h4>
                              <p className="text-sm text-blue-700 mb-2">{recommendation.description}</p>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  {recommendation.category}
                                </Badge>
                                <Badge variant={getImpactBadge(recommendation.impact)} className="text-xs">
                                  {recommendation.impact} impact
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="content" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Content Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Word Count</span>
                          <span className="text-sm font-semibold">{auditResult.pageContent.wordCount}</span>
                        </div>
                        <div className="text-xs text-gray-500">Recommended: 300+ words</div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Readability Score</span>
                          <span className="text-sm font-semibold">{auditResult.pageContent.readabilityScore.toFixed(1)}</span>
                        </div>
                        <div className="text-xs text-gray-500">Higher is better (60+ is good)</div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Title Length</span>
                          <span className="text-sm font-semibold">{auditResult.pageContent.title.length} chars</span>
                        </div>
                        <div className="text-xs text-gray-500">Optimal: 30-60 characters</div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Meta Description</span>
                          <span className="text-sm font-semibold">{auditResult.pageContent.metaDescription.length} chars</span>
                        </div>
                        <div className="text-xs text-gray-500">Optimal: 120-160 characters</div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Image className="h-5 w-5" />
                        Images & Links
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Total Images</span>
                          <span className="text-sm font-semibold">{auditResult.pageContent.images.length}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          With Alt Text: {auditResult.pageContent.images.filter(img => img.hasAlt).length}
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Total Links</span>
                          <span className="text-sm font-semibold">{auditResult.pageContent.links.length}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          Internal: {auditResult.pageContent.links.filter(link => link.isInternal).length}
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Heading Structure</span>
                          <span className="text-sm font-semibold">{auditResult.pageContent.headings.length} headings</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          H1: {auditResult.pageContent.headings.filter(h => h.level === 1).length}, 
                          H2: {auditResult.pageContent.headings.filter(h => h.level === 2).length}, 
                          H3+: {auditResult.pageContent.headings.filter(h => h.level >= 3).length}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
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
                          <Shield className="h-4 w-4" />
                          <AlertDescription>
                            <strong>HTTPS Security:</strong> {auditResult.technicalMetrics.httpsEnabled ? 'Enabled ✓' : 'Not enabled ✗'}
                          </AlertDescription>
                        </Alert>

                        <Alert>
                          <FileText className="h-4 w-4" />
                          <AlertDescription>
                            <strong>Meta Tags Found:</strong> {auditResult.technicalMetrics.metaTagsCount} tags detected
                          </AlertDescription>
                        </Alert>

                        <Alert>
                          <BarChart3 className="h-4 w-4" />
                          <AlertDescription>
                            <strong>Heading Structure:</strong> {auditResult.technicalMetrics.headingsStructure ? 'Properly structured ✓' : 'Needs improvement ✗'}
                          </AlertDescription>
                        </Alert>

                        <Alert>
                          <Search className="h-4 w-4" />
                          <AlertDescription>
                            <strong>Structured Data:</strong> {auditResult.structuredData.hasSchema ? 'Found ✓' : 'Missing ✗'}
                          </AlertDescription>
                        </Alert>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="social" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Link className="h-5 w-5" />
                      Social Media & Structured Data
                    </CardTitle>
                    <CardDescription>
                      Social sharing optimization and structured data analysis
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3">Open Graph Tags</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Open Graph Present</span>
                            <Badge variant={auditResult.socialMedia.hasOpenGraph ? "default" : "destructive"}>
                              {auditResult.socialMedia.hasOpenGraph ? "Yes" : "No"}
                            </Badge>
                          </div>
                          {auditResult.socialMedia.ogTitle && (
                            <div>
                              <span className="text-sm font-medium">OG Title:</span>
                              <p className="text-sm text-gray-600 mt-1">{auditResult.socialMedia.ogTitle}</p>
                            </div>
                          )}
                          {auditResult.socialMedia.ogDescription && (
                            <div>
                              <span className="text-sm font-medium">OG Description:</span>
                              <p className="text-sm text-gray-600 mt-1">{auditResult.socialMedia.ogDescription}</p>
                            </div>
                          )}
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Twitter Cards</span>
                            <Badge variant={auditResult.socialMedia.hasTwitterCards ? "default" : "destructive"}>
                              {auditResult.socialMedia.hasTwitterCards ? "Yes" : "No"}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3">Structured Data</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Schema Markup</span>
                            <Badge variant={auditResult.structuredData.hasSchema ? "default" : "destructive"}>
                              {auditResult.structuredData.hasSchema ? "Found" : "Missing"}
                            </Badge>
                          </div>
                          {auditResult.structuredData.types.length > 0 && (
                            <div>
                              <span className="text-sm font-medium">Schema Types:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {auditResult.structuredData.types.map((type, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {type}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          {auditResult.structuredData.errors.length > 0 && (
                            <div>
                              <span className="text-sm font-medium text-red-600">Issues:</span>
                              <ul className="text-sm text-red-600 mt-1 space-y-1">
                                {auditResult.structuredData.errors.map((error, index) => (
                                  <li key={index}>• {error}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
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