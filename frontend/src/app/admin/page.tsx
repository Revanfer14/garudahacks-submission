'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { runUpload } from '../data/uploadToFirestore';

export default function AdminPage() {
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleUpload = async () => {
    setUploading(true);
    setUploadStatus('idle');
    
    try {
      const result = await runUpload();
      setUploadStatus(result ? 'success' : 'error');
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadStatus('error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Admin Panel - Dongeng Upload</h1>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Data to Firestore
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Click the button below to upload your static dongeng data to Firestore. 
              This will create documents in the &quot;dongengs&quot; collection with the same IDs as your static data.
            </p>
            
            <div className="flex items-center gap-4">
              <Button 
                onClick={handleUpload} 
                disabled={uploading}
                className="flex items-center gap-2"
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    Upload to Firestore
                  </>
                )}
              </Button>
              
              {uploadStatus === 'success' && (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  Upload successful!
                </div>
              )}
              
              {uploadStatus === 'error' && (
                <div className="flex items-center gap-2 text-red-600">
                  <XCircle className="h-4 w-4" />
                  Upload failed. Check console for errors.
                </div>
              )}
            </div>
            
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold mb-2">What this does:</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Uploads all dongeng data to Firestore collection &quot;dongengs&quot;</li>
                <li>• Uses the same IDs as your static data (1, 2, 3, etc.)</li>
                <li>• Includes title, region, category, content, moral, and description</li>
                <li>• Your app will automatically start using Firestore data once uploaded</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
