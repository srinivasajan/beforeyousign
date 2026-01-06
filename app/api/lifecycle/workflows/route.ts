import { NextRequest, NextResponse } from 'next/server';
import { ContractLifecycleManager, ApprovalWorkflow } from '@/lib/contract-lifecycle-automation';
import { getServerSession } from 'next-auth';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { action, ...data } = body;

    const manager = new ContractLifecycleManager();

    switch (action) {
      case 'create': {
        const { contractId, approvers, ...config } = data;
        const workflow = manager.createDefaultApprovalWorkflow(contractId, approvers, config);
        return NextResponse.json(workflow);
      }

      case 'approve': {
        const { workflowId, step, approverId, comments } = data;
        const result = await manager.processApproval(
          workflowId,
          step,
          approverId,
          'approved',
          comments
        );
        return NextResponse.json(result);
      }

      case 'reject': {
        const { workflowId, step, approverId, comments } = data;
        const result = await manager.processApproval(
          workflowId,
          step,
          approverId,
          'rejected',
          comments
        );
        return NextResponse.json(result);
      }

      case 'obligations': {
        const { contractId, contractText } = data;
        const obligations = await manager.extractObligations(contractId, contractText);
        return NextResponse.json(obligations);
      }

      case 'renewals': {
        const contracts = data.contracts || [];
        const alerts = await manager.checkRenewals(contracts);
        return NextResponse.json(alerts);
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Lifecycle API error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
